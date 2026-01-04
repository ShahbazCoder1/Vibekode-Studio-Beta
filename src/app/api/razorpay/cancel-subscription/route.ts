import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
    try {
        const { subscriptionId, idToken } = await request.json();

        if (!subscriptionId || !idToken) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // Verify Firebase Token
        try {
            await adminAuth.verifyIdToken(idToken);
        } catch (error: unknown) {
            return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid token" }, { status: 401 });
        }

        await razorpay.subscriptions.cancel(subscriptionId);

        return NextResponse.json({ success: true });

    } catch (error: unknown) {
        console.error("Razorpay Cancel Subscription Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to cancel subscription" },
            { status: 500 }
        );
    }
}
