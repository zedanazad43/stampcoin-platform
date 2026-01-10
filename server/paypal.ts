interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  app_id?: string;
  expires_in: number;
  nonce?: string;
}

interface PayPalLink {
  href: string;
  rel: string;
  method: string;
}

interface CreateOrderParams {
  amount: number;
  currency?: string;
  description?: string;
  returnUrl: string;
  cancelUrl: string;
  userId: number;
  stampId: number;
  productId: string;
}

interface CaptureOrderResult {
  status: string;
  orderId: string;
  payerEmail?: string;
  amount?: string;
  currency?: string;
  customId?: string;
}

const DEFAULT_CURRENCY = "USD";

const PAYPAL_BASE_URL = (process.env.PAYPAL_MODE || "sandbox") === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

let cachedToken: { token: string; expiresAt: number } | null = null;

export function isPayPalEnabled(): boolean {
  return process.env.PAYPAL_ENABLED === "true" && !!process.env.PAYPAL_CLIENT_ID && !!process.env.PAYPAL_CLIENT_SECRET;
}

async function getAccessToken(): Promise<string> {
  if (!isPayPalEnabled()) {
    throw new Error("PayPal is not enabled. Set PAYPAL_ENABLED=true and provide credentials.");
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.token;
  }

  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  } satisfies RequestInit);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to obtain PayPal token (${res.status}): ${body}`);
  }

  const data = (await res.json()) as PayPalTokenResponse;
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

export async function createOrder(params: CreateOrderParams): Promise<{ orderId: string; approvalUrl: string }> {
  const token = await getAccessToken();

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: params.currency || DEFAULT_CURRENCY,
          value: params.amount.toFixed(2),
        },
        description: params.description?.slice(0, 127),
        custom_id: `${params.userId}:${params.stampId}:${params.productId}`,
      },
    ],
    application_context: {
      brand_name: "StampCoin",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url: params.returnUrl,
      cancel_url: params.cancelUrl,
    },
  };

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  } satisfies RequestInit);

  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(`PayPal order creation failed (${res.status}): ${bodyText}`);
  }

  const data = (await res.json()) as { id: string; links?: PayPalLink[] };
  const approvalLink = data.links?.find(link => link.rel === "approve");

  if (!approvalLink?.href) {
    throw new Error("Missing PayPal approval URL in response");
  }

  return {
    orderId: data.id,
    approvalUrl: approvalLink.href,
  };
}

export async function captureOrder(orderId: string): Promise<CaptureOrderResult> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  } satisfies RequestInit);

  if (!res.ok) {
    const bodyText = await res.text();
    throw new Error(`PayPal capture failed (${res.status}): ${bodyText}`);
  }

  const data = (await res.json()) as any;
  const purchaseUnit = data.purchase_units?.[0];
  const payment = purchaseUnit?.payments?.captures?.[0];

  return {
    status: data.status,
    orderId: data.id,
    payerEmail: data.payer?.email_address,
    amount: payment?.amount?.value,
    currency: payment?.amount?.currency_code,
    customId: purchaseUnit?.custom_id,
  };
}
