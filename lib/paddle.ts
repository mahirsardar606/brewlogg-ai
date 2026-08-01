import type { Profile } from "@/types";

const PADDLE_VENDOR_ID = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
const PADDLE_API_KEY = process.env.PADDLE_API_KEY;

const PADDLE_API_BASE =
  process.env.PADDLE_API_BASE ||
  (process.env.NODE_ENV === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com");

export async function createPaddleTransaction(
  profile: Profile,
  priceId: string
) {
  if (!PADDLE_API_KEY) {
    throw new Error("PADDLE_API_KEY not configured");
  }

  const response = await fetch(
    `${PADDLE_API_BASE}/checkout/transactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PADDLE_API_KEY}`,
      },
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        customer: {
          email: profile.email,
          id: profile.paddle_customer_id ?? undefined,
        },
        custom_data: {
          user_id: profile.id,
        },
        settings: {
          display_mode: "overlay",
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Paddle API error: ${response.statusText}`);
  }

  return response.json();
}

export async function generatePaddleCheckoutLink(
  email: string,
  priceId: string
): Promise<string> {
  if (!PADDLE_VENDOR_ID) {
    throw new Error("PADDLE_CLIENT_TOKEN not configured");
  }

  // In production, this would use Paddle's API to generate a checkout link
  // For now, we'll construct the standard checkout URL
  return `https://checkout.paddle.com/checkout/${priceId}`;
}
