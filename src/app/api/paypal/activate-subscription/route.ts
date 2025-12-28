import { NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_URL } from "@/lib/paypal";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const { subscriptionId, idToken } = await request.json();

    if (!idToken || !subscriptionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const accessToken = await getPayPalAccessToken();

    // Get subscription details from PayPal
    const response = await fetch(
      `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "Failed to get subscription details"
      );
    }

    const subscription = await response.json();

    // Verify subscription belongs to this user
    if (subscription.custom_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Determine plan type and credits
    let subscriptionType: "go" | "pro" = "go";
    let monthlyCredits = 50;

    const { PAYPAL_PLAN_IDS } = await import("@/lib/paypal");
    if (subscription.plan_id === PAYPAL_PLAN_IDS.PRO) {
      subscriptionType = "pro";
      monthlyCredits = 150;
    }

    // Update user document
    await adminDb
      .collection("users")
      .doc(userId)
      .update({
        subscriptionType,
        subscriptionStatus:
          subscription.status === "ACTIVE" ? "active" : "pending",
        paypalSubscriptionId: subscriptionId,
        monthlyCredits,
        creditsUsed: 0,
        nextBillingDate: subscription.billing_info?.next_billing_time || null,
        updatedAt: FieldValue.serverTimestamp(),
      });

    // Create subscription record
    await adminDb.collection("subscriptions").doc(subscriptionId).set(
      {
        userId,
        status: subscription.status.toLowerCase(),
        planId: subscription.plan_id,
        startDate: subscription.start_time,
        paypalSubscriptionId: subscriptionId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      subscription: {
        type: subscriptionType,
        status: subscription.status,
        credits: monthlyCredits,
      },
    });
  } catch (error: unknown) {
    console.error("Error activating subscription:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to activate subscription";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
