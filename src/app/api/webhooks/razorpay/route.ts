import { NextResponse } from "next/server";
import crypto from "crypto";
import { RAZORPAY_WEBHOOK_SECRET, RAZORPAY_PLAN_IDS } from "@/lib/razorpay";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get("x-razorpay-signature");

        console.log("📥 Razorpay Webhook Received");

        if (!RAZORPAY_WEBHOOK_SECRET) {
            console.error("❌ RAZORPAY_WEBHOOK_SECRET not set");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        if (!signature) {
            console.error("❌ Missing Signature in webhook");
            return NextResponse.json({ error: "Missing Signature" }, { status: 400 });
        }

        // Verify Signature
        const expectedSignature = crypto
            .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
            .update(rawBody)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("❌ Invalid Razorpay Webhook Signature");
            console.error("Expected:", expectedSignature);
            console.error("Received:", signature);
            return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
        }

        console.log("✅ Webhook signature verified");

        const body = JSON.parse(rawBody);
        const event = body.event;
        const payload = body.payload;

        console.log(`📊 Processing Razorpay Event: ${event}`);
        console.log("Payload:", JSON.stringify(payload, null, 2));

        if (event === "subscription.activated") {
            // Handle initial activation
            const subscription = payload.subscription.entity;
            const userId = subscription.notes?.userId;
            const tierName = subscription.notes?.tierName;

            console.log("🔍 Subscription Activated Event");
            console.log("User ID:", userId);
            console.log("Tier:", tierName);
            console.log("Subscription ID:", subscription.id);

            if (!userId) {
                console.error("❌ No userId found in subscription notes");
                return NextResponse.json({ received: true });
            }

            let credits = 0;
            let tierLower = "free";

            if (subscription.plan_id === RAZORPAY_PLAN_IDS.GO) {
                credits = 50;
                tierLower = "go";
            } else if (subscription.plan_id === RAZORPAY_PLAN_IDS.PRO) {
                credits = 150;
                tierLower = "pro";
            } else if (tierName) {
                tierLower = tierName.toLowerCase();
                if (tierLower === 'go') credits = 50;
                if (tierLower === 'pro') credits = 150;
            }

            console.log("💳 Updating user with credits:", credits);

            await adminDb.collection("users").doc(userId).update({
                subscriptionStatus: "active",
                subscriptionProvider: "razorpay",
                razorpaySubscriptionId: subscription.id,
                subscriptionType: tierLower,
                monthlyCredits: credits,
                creditsUsed: 0,
                lastPaymentDate: new Date(subscription.start_at * 1000).toISOString(),
                nextBillingDate: subscription.charge_at ? new Date(subscription.charge_at * 1000).toISOString() : null,
                updatedAt: FieldValue.serverTimestamp(),
            });

            await adminDb.collection("subscriptions").doc(subscription.id).set({
                userId,
                provider: "razorpay",
                status: "active",
                planId: subscription.plan_id,
                startDate: new Date(subscription.start_at * 1000).toISOString(),
                razorpaySubscriptionId: subscription.id,
                updatedAt: FieldValue.serverTimestamp(),
            }, { merge: true });

            console.log("✅ User and subscription records updated");

        } else if (event === "subscription.charged") {
            const subscription = payload.subscription.entity;
            const payment = payload.payment.entity;
            const userId = subscription.notes?.userId;
            const tierName = subscription.notes?.tierName || "Unknown";

            console.log("💰 Subscription Charged Event");
            console.log("User ID:", userId);
            console.log("Payment ID:", payment.id);

            if (!userId) {
                console.error("❌ No userId found in subscription notes");
                return NextResponse.json({ received: true });
            }

            let credits = 0;
            let tierLower = "free";

            if (subscription.plan_id === RAZORPAY_PLAN_IDS.GO) {
                credits = 50;
                tierLower = "go";
            } else if (subscription.plan_id === RAZORPAY_PLAN_IDS.PRO) {
                credits = 150;
                tierLower = "pro";
            } else if (tierName) {
                tierLower = tierName.toLowerCase();
                if (tierLower === 'go') credits = 50;
                if (tierLower === 'pro') credits = 150;
            }

            await adminDb.collection("users").doc(userId).update({
                subscriptionStatus: "active",
                subscriptionProvider: "razorpay",
                razorpaySubscriptionId: subscription.id,
                subscriptionType: tierLower,
                monthlyCredits: credits,
                creditsUsed: 0,
                lastPaymentDate: new Date(payment.created_at * 1000).toISOString(),
                nextBillingDate: subscription.charge_at ? new Date(subscription.charge_at * 1000).toISOString() : null,
                updatedAt: FieldValue.serverTimestamp(),
            });

            await adminDb.collection("subscriptions").doc(subscription.id).set({
                userId,
                provider: "razorpay",
                status: "active",
                planId: subscription.plan_id,
                startDate: new Date(subscription.start_at * 1000).toISOString(),
                razorpaySubscriptionId: subscription.id,
                updatedAt: FieldValue.serverTimestamp(),
            }, { merge: true });

            // Log Transaction
            await adminDb.collection("transactions").add({
                userId,
                provider: "razorpay",
                subscriptionId: subscription.id,
                paymentId: payment.id,
                amount: payment.amount / 100,
                currency: payment.currency,
                eventType: event,
                createdAt: FieldValue.serverTimestamp(),
            });

            console.log("✅ Payment processed and records updated");

        } else if (event === "subscription.cancelled" || event === "subscription.halted") {
            const subscription = payload.subscription.entity;
            const userId = subscription.notes?.userId;

            console.log(`🚫 Subscription ${event} Event`);

            if (userId) {
                const status = event === "subscription.halted" ? "failed" : "cancelled";

                await adminDb.collection("users").doc(userId).update({
                    subscriptionStatus: status,
                    updatedAt: FieldValue.serverTimestamp(),
                });

                await adminDb.collection("subscriptions").doc(subscription.id).update({
                    status: status,
                    updatedAt: FieldValue.serverTimestamp(),
                });

                console.log("✅ Cancellation processed");
            }
        } else {
            console.log("ℹ️ Unhandled event type:", event);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("❌ Error processing Razorpay webhook:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
