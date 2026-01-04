import { NextResponse } from "next/server";
import { razorpay, RAZORPAY_PLAN_IDS } from "@/lib/razorpay";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
    try {
        const { tierName, idToken } = await request.json();

        if (!tierName || !idToken) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // Verify Firebase Token
        let decodedToken;
        try {
            decodedToken = await adminAuth.verifyIdToken(idToken);
        } catch (error: unknown) {
            return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid token" }, { status: 401 });
        }

        const userId = decodedToken.uid;
        const planKey = tierName.toUpperCase() as keyof typeof RAZORPAY_PLAN_IDS;
        const planId = RAZORPAY_PLAN_IDS[planKey];

        if (!planId) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // Create Subscription on Razorpay
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: 120, // Max billing cycles, basically continuous
            quantity: 1,
            customer_notify: 1, // Notify customer via email/SMS
            notes: {
                userId: userId, // Pass userId in notes for webhook identification
                tierName: tierName,
            }
        });

        // Optionally, store the initial/pending status in Firestore if you want strict tracking
        // (webhook will handle the activation and definitive record)

        return NextResponse.json({
            subscriptionId: subscription.id,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error: unknown) {
        console.error("Razorpay Create Subscription Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create subscription" },
            { status: 500 }
        );
    }
}
