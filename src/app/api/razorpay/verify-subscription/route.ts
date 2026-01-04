import { NextResponse } from "next/server";
import { razorpay, RAZORPAY_PLAN_IDS } from "@/lib/razorpay";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
    try {
        const { subscriptionId, idToken } = await request.json();

        console.log("🔍 Verify Subscription Request:", subscriptionId);

        if (!subscriptionId || !idToken) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // Verify Firebase Token
        let decodedToken;
        try {
            decodedToken = await adminAuth.verifyIdToken(idToken);
        } catch (error) {
            console.error("❌ Invalid Firebase token:", error);
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const userId = decodedToken.uid;
        console.log("✅ User verified:", userId);

        // Fetch Subscription from Razorpay
        const subscription = await razorpay.subscriptions.fetch(subscriptionId);

        if (!subscription) {
            console.error("❌ Subscription not found on Razorpay");
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        console.log("📊 Subscription status:", subscription.status);
        console.log("📊 Subscription plan:", subscription.plan_id);

        // Handle any status that indicates the subscription exists and was paid
        if (subscription.status === "active" || subscription.status === "authenticated" || subscription.status === "created") {
            // Determine credits based on plan
            let credits = 0;
            let tierName = "free";

            if (subscription.plan_id === RAZORPAY_PLAN_IDS.GO) {
                credits = 50;
                tierName = "go";
            }
            else if (subscription.plan_id === RAZORPAY_PLAN_IDS.PRO) {
                credits = 150;
                tierName = "pro";
            } else {
                const noteTier = subscription.notes?.tierName;
                if (noteTier === 'Go') { credits = 50; tierName = "go"; }
                else if (noteTier === 'Pro') { credits = 150; tierName = "pro"; }
            }

            console.log("💳 Activating subscription with credits:", credits);

            // Update Users Collection
            await adminDb.collection("users").doc(userId).update({
                subscriptionStatus: "active",
                subscriptionProvider: "razorpay",
                razorpaySubscriptionId: subscription.id,
                subscriptionType: tierName,
                monthlyCredits: credits,
                creditsUsed: 0,
                lastPaymentDate: subscription.current_start ? new Date(subscription.current_start * 1000).toISOString() : new Date().toISOString(),
                nextBillingDate: subscription.charge_at ? new Date(subscription.charge_at * 1000).toISOString() : null,
                updatedAt: FieldValue.serverTimestamp(),
            });

            // Update Subscriptions Collection
            await adminDb.collection("subscriptions").doc(subscription.id).set({
                userId,
                provider: "razorpay",
                status: "active",
                planId: subscription.plan_id,
                startDate: subscription.start_at ? new Date(subscription.start_at * 1000).toISOString() : new Date().toISOString(),
                razorpaySubscriptionId: subscription.id,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            }, { merge: true });

            // Log the transaction
            await adminDb.collection("transactions").add({
                userId,
                provider: "razorpay",
                subscriptionId: subscription.id,
                eventType: "subscription.verified",
                amount: subscription.plan_id === RAZORPAY_PLAN_IDS.GO ? 499 : 1499, // Approximate amounts
                currency: "INR",
                createdAt: FieldValue.serverTimestamp(),
            });

            console.log("✅ Subscription activated successfully");

            return NextResponse.json({
                success: true,
                subscription: { type: tierName, status: subscription.status }
            });
        } else {
            console.warn("⚠️ Subscription status not active:", subscription.status);
            return NextResponse.json({
                success: false,
                error: `Subscription status is ${subscription.status}. Please wait for activation or contact support.`
            });
        }

    } catch (error: unknown) {
        console.error("❌ Razorpay Verification Error:", error);
        console.error("Error details:", error instanceof Error ? error.message : "Unknown error");
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace available");
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to verify subscription" },
            { status: 500 }
        );
    }
}
