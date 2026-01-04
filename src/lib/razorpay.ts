import Razorpay from 'razorpay';

const key_id = process.env.RAZORPAY_KEY_ID || "";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "";

if (!key_id || !key_secret) {
    console.warn("Razorpay credentials not set in environment variables.");
}

export const razorpay = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

export const RAZORPAY_PLAN_IDS = {
    GO: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_GO || "",
    PRO: process.env.NEXT_PUBLIC_RAZORPAY_PLAN_ID_PRO || "",
};

// Validate plan IDs on module load
if (!RAZORPAY_PLAN_IDS.GO || !RAZORPAY_PLAN_IDS.PRO) {
    console.warn("⚠️ Razorpay Plan IDs not configured properly in environment variables");
}

export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";
