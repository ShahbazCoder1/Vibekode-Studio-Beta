import { NextResponse } from "next/server";
import { getPayPalAccessToken, PAYPAL_API_URL } from "@/lib/paypal";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { subscriptionId, idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Missing subscriptionId" },
        { status: 400 }
      );
    }

    const userDoc = await adminDb.collection("users").doc(userId).get();
    const userData = userDoc.data();

    if (userData?.paypalSubscriptionId !== subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID does not match user record" },
        { status: 403 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          reason: "User requested cancellation via settings",
        }),
      }
    );

    if (!response.ok) {
      // 204 No Content is success
      if (response.status !== 204) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to cancel at PayPal");
      }
    }

    await adminDb.collection("users").doc(userId).update({
      subscriptionStatus: "cancelled",
      // subscriptionType: 'free', // Optional: downgrade immediately or wait for expiry?
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error canceling subscription:", error);

    const message =
      error instanceof Error ? error.message : "Failed to cancel subscription";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
