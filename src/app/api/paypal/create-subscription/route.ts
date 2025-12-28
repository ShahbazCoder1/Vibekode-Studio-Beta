import { NextResponse } from "next/server";
import {
  getPayPalAccessToken,
  PAYPAL_API_URL,
  PAYPAL_PLAN_IDS,
} from "@/lib/paypal";
import { adminAuth } from "@/lib/firebase-admin";

interface PayPalLink {
  href: string;
  rel: string;
  method?: string;
}

export async function POST(request: Request) {
  try {
    const { tierName, idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!tierName || !userId) {
      return NextResponse.json(
        { error: "Missing tierName or userId" },
        { status: 400 }
      );
    }

    let planId = "";
    if (tierName === "Go") planId = PAYPAL_PLAN_IDS.GO;
    if (tierName === "Pro") planId = PAYPAL_PLAN_IDS.PRO;

    if (!planId) {
      console.error(`Invalid Plan ID for tier ${tierName}`);
      return NextResponse.json(
        {
          error: "Invalid subscription plan",
        },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const body = {
      plan_id: planId,
      custom_id: userId,
      application_context: {
        brand_name: "VibeKode Studio",
        user_action: "SUBSCRIBE_NOW",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      },
    };

    console.log("Creating PayPal subscription with:", {
      tierName,
      planId,
      userId,
    });

    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal API Error:", {
        status: response.status,
        statusText: response.statusText,
        data: JSON.stringify(data, null, 2),
      });
      throw new Error(
        data.message ||
          data.error_description ||
          "Failed to create subscription"
      );
    }

    const approvalLink = (data.links as PayPalLink[] | undefined)?.find(
      (link) => link.rel === "approve"
    );

    if (!approvalLink) {
      console.error("No approval link in PayPal response:", data);
      throw new Error("No approval link found in PayPal response");
    }

    console.log("Subscription created successfully:", data.id);

    return NextResponse.json({
      approvalUrl: approvalLink.href,
      subscriptionId: data.id,
    });
  } catch (error: unknown) {
    console.error("Error creating subscription:", error);

    const message =
      error instanceof Error ? error.message : "Failed to create subscription";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
