import {
    Client,
    Environment,
    OrdersController,
} from "@paypal/paypal-server-sdk";
import crypto from 'crypto';

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET || "";

if (!clientId || !clientSecret) {
    console.warn("PayPal credentials not set in environment variables.");
}

export const PAYPAL_PLAN_IDS = {
    GO: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_GO || "",
    PRO: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PRO || "",
};

// Validate plan IDs on module load
if (!PAYPAL_PLAN_IDS.GO || !PAYPAL_PLAN_IDS.PRO) {
    console.warn("⚠️ PayPal Plan IDs not configured properly in environment variables");
}

const environment =
    process.env.NEXT_PUBLIC_PAYPAL_ENV === "production"
        ? Environment.Production
        : Environment.Sandbox;

export const paypalClient = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: clientId,
        oAuthClientSecret: clientSecret,
    },
    timeout: 0,
    environment: environment,
    // logging: { ... } // Removed to avoid type issues
});

export const ordersController = new OrdersController(paypalClient);

/**
 * Verify PayPal Webhook Signature
 * @param headers HTTP Headers from the request
 * @param rawBody Raw request body as string (not parsed JSON)
 * @param webhookId The Webhook ID configured in PayPal Dashboard
 */
export async function verifyPayPalWebhookSignature(
    headers: Record<string, string | undefined>,
    rawBody: string,
    webhookId: string
): Promise<boolean> {
    try {
        // Extract required headers
        const transmissionId = headers['paypal-transmission-id'];
        const transmissionTime = headers['paypal-transmission-time'];
        const certUrl = headers['paypal-cert-url'];
        const actualSignature = headers['paypal-transmission-sig'];
        const authAlgo = headers['paypal-auth-algo'];

        // Validate required headers are present
        if (!transmissionId || !transmissionTime || !certUrl || !actualSignature || !authAlgo) {
            console.error('Missing required PayPal webhook headers');
            return false;
        }

        // Validate certificate URL is from PayPal
        if (!certUrl.startsWith('https://api.paypal.com/') && 
            !certUrl.startsWith('https://api.sandbox.paypal.com/') &&
            !certUrl.startsWith('https://api-m.paypal.com/') &&
            !certUrl.startsWith('https://api-m.sandbox.paypal.com/')) {
            console.error('Invalid PayPal certificate URL');
            return false;
        }

        // Get PayPal's public certificate
        const certResponse = await fetch(certUrl);
        if (!certResponse.ok) {
            console.error('Failed to fetch PayPal certificate');
            return false;
        }
        const certPem = await certResponse.text();

        // Construct the expected signature string
        // Format: transmission_id|transmission_time|webhook_id|crc32(body)
        const crc32 = calculateCRC32(rawBody);
        const expectedSignatureString = `${transmissionId}|${transmissionTime}|${webhookId}|${crc32}`;

        // Verify the signature
        const verify = crypto.createVerify('SHA256');
        verify.update(expectedSignatureString);
        verify.end();

        const isValid = verify.verify(certPem, actualSignature, 'base64');

        if (!isValid) {
            console.error('PayPal webhook signature verification failed');
        }

        return isValid;
    } catch (error) {
        console.error('Webhook verification error:', error);
        return false;
    }
}

/**
 * Calculate CRC32 checksum of the webhook body
 * @param str The raw body string
 */
function calculateCRC32(str: string): number {
    const table = makeCRCTable();
    let crc = 0 ^ (-1);

    for (let i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ table[(crc ^ str.charCodeAt(i)) & 0xFF];
    }

    return (crc ^ (-1)) >>> 0;
}

/**
 * Generate CRC32 lookup table
 */
function makeCRCTable(): number[] {
    let c: number;
    const crcTable: number[] = [];
    
    for (let n = 0; n < 256; n++) {
        c = n;
        for (let k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    
    return crcTable;
}

// Helper to get Access Token
export async function getPayPalAccessToken(): Promise<string> {
    if (!clientId || !clientSecret) throw new Error("Missing PayPal Credentials");

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    // Choose environment
    // Sandbox: https://api-m.sandbox.paypal.com
    // Production: https://api-m.paypal.com
    // Defaulting to Sandbox for safety as requested
    const baseUrl = process.env.NEXT_PUBLIC_PAYPAL_ENV === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${auth}`,
        },
        body: "grant_type=client_credentials",
    });

    const data = await response.json();
    if (!data.access_token) {
        throw new Error("Failed to authenticate with PayPal: " + JSON.stringify(data));
    }
    return data.access_token;
}

export const PAYPAL_API_URL = process.env.NEXT_PUBLIC_PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
