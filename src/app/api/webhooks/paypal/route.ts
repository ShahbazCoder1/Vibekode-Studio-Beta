import { NextResponse } from "next/server";
import { verifyPayPalWebhookSignature } from "@/lib/paypal";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    console.error("PAYPAL_WEBHOOK_ID is not set.");
    return NextResponse.json(
      { error: "Server Configuration Error" },
      { status: 500 }
    );
  }

  // 1. Verify Signature
  const rawBody = await request.text();
  const headersRecord = Object.fromEntries(request.headers.entries());
  const isValid = await verifyPayPalWebhookSignature(
    headersRecord,
    rawBody,
    webhookId
  );
  if (!isValid) {
    console.warn("Invalid PayPal Webhook Signature");
    return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
  }

  const body = JSON.parse(rawBody);
  const eventType = body.event_type;
  const resource = body.resource;

  // Custom ID in subscription usually maps to our userId
  // PayPal sends it in 'custom_id' field of the subscription resource
  let userId = resource.custom_id;

  // Sometimes userId might be in a different place depending on the event
  // For SALE.COMPLETED, we might need to look up the subscription to find the user, or rely on stored subscription map.
  // But usually, we passed it during creation.
  // IMPORTANT: For checks like PAYMENT.SALE.COMPLETED, resource is a 'sale' object which may NOT have custom_id directly.
  // It usually has 'billing_agreement_id' which matches the subscription ID.

  const subscriptionId = resource.billing_agreement_id || resource.id;

  try {
    // If we don't have userId directly (e.g. sale event), try to find it via subscriptionId in our DB
    if (!userId && subscriptionId) {
      const subscriptionsSnapshot = await adminDb
        .collection("subscriptions")
        .where("paypalSubscriptionId", "==", subscriptionId)
        .limit(1)
        .get();
      if (!subscriptionsSnapshot.empty) {
        userId = subscriptionsSnapshot.docs[0].data().userId;
      } else {
        // Fallback: search users collection
        const userSnapshot = await adminDb
          .collection("users")
          .where("paypalSubscriptionId", "==", subscriptionId)
          .limit(1)
          .get();
        if (!userSnapshot.empty) {
          userId = userSnapshot.docs[0].id;
        }
      }
    }

    if (!userId) {
      console.error(
        `Could not find User ID for subscription: ${subscriptionId}, Event: ${eventType}`
      );
      return NextResponse.json({ received: true }); // Acknowledge anyway to stop retries if logic fails
    }

    console.log(`Processing PayPal Event: ${eventType} for User: ${userId}`);

    // Log the transaction/event
    await adminDb.collection("transactions").add({
      userId,
      paypalSubscriptionId: subscriptionId,
      eventId: body.id,
      eventType,
      resource,
      createdAt: FieldValue.serverTimestamp(),
    });

    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      await adminDb
        .collection("users")
        .doc(userId)
        .update({
          subscriptionStatus: "active",
          paypalSubscriptionId: subscriptionId,
          subscriptionType: await getPlanType(resource.plan_id),
          nextBillingDate: resource.billing_info?.next_billing_time || null,
        });

      await adminDb.collection("subscriptions").doc(subscriptionId).set(
        {
          userId,
          status: "active",
          planId: resource.plan_id,
          startDate: resource.start_time,
          paypalSubscriptionId: subscriptionId,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } else if (eventType === "PAYMENT.SALE.COMPLETED") {
      // Monthly payment successful - reset credits
      const planType = await getPlanType(resource.plan_id || subscriptionId);
      const credits = planType === "go" ? 50 : planType === "pro" ? 150 : 0;

      await adminDb
        .collection("users")
        .doc(userId)
        .update({
          monthlyCredits: credits,
          creditsUsed: 0,
          subscriptionStatus: "active",
          lastPaymentDate: resource.create_time,
          nextBillingDate: resource.billing_info?.next_billing_time || null,
        });
    }
    // ✅ User manually cancels (keeps access until period end)
    else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      const nextBillingDate = resource.billing_info?.next_billing_time;

      await adminDb.collection("users").doc(userId).update({
        subscriptionStatus: "cancelled",
        subscriptionEndDate: nextBillingDate, // Keep premium until this date
      });

      await adminDb.collection("subscriptions").doc(subscriptionId).update({
        status: "cancelled",
        expiresAt: nextBillingDate,
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    // ✅ Subscription period ends (after cancellation or expiry)
    else if (eventType === "BILLING.SUBSCRIPTION.EXPIRED") {
      // Downgrade to free tier
      await adminDb.collection("users").doc(userId).update({
        subscriptionStatus: "none",
        subscriptionType: "free",
        monthlyCredits: 0,
        creditsUsed: 0,
        paypalSubscriptionId: null,
        subscriptionEndDate: null,
      });

      await adminDb.collection("subscriptions").doc(subscriptionId).update({
        status: "expired",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
    // ✅ IMMEDIATE DOWNGRADE: Payment failed (1 failure = cancel)
    else if (
      eventType === "BILLING.SUBSCRIPTION.PAYMENT.FAILED" ||
      eventType === "BILLING.SUBSCRIPTION.SUSPENDED"
    ) {
      // Since your PayPal plan auto-cancels after 1 failed payment,
      // immediately downgrade to free tier
      await adminDb.collection("users").doc(userId).update({
        subscriptionStatus: "none",
        subscriptionType: "free",
        monthlyCredits: 0,
        creditsUsed: 0,
        paypalSubscriptionId: null,
        subscriptionEndDate: null,
      });

      await adminDb.collection("subscriptions").doc(subscriptionId).update({
        status: "failed",
        failureReason: "Payment failed",
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Optional: Log the failure for records
      await adminDb.collection("payment_failures").add({
        userId,
        subscriptionId,
        eventType,
        timestamp: FieldValue.serverTimestamp(),
        resource,
      });

      console.log(
        `⚠️ Payment failed for user ${userId}. Downgraded to free tier.`
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function getPlanType(planId: string): Promise<"go" | "pro" | "free"> {
  const { PAYPAL_PLAN_IDS } = await import("@/lib/paypal");

  if (planId === PAYPAL_PLAN_IDS.GO) return "go";
  if (planId === PAYPAL_PLAN_IDS.PRO) return "pro";
  return "free";
}
