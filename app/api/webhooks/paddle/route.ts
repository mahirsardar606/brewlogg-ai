import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

function verifyPaddleSignature(rawBody: string, pSignature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("base64");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(pSignature));
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const pSignature = request.headers.get("p_signature") || "";

    if (!process.env.PADDLE_WEBHOOK_SECRET) {
      console.warn("Paddle webhook secret not configured — accepting unverified webhook");
    } else if (!pSignature || !verifyPaddleSignature(rawBody, pSignature, process.env.PADDLE_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { event_type, data } = body;

    const supabase = await createClient();
    let userId = data?.custom_data?.user_id || body?.custom_data?.user_id;

    if (!userId && event_type === "subscription.canceled") {
      const subId = data?.id?.toString();
      if (subId) {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("id")
          .eq("paddle_subscription_id", subId)
          .single();
        userId = (profileRow as { id: string } | null)?.id ?? undefined;
      }
    }

    if (!userId && data?.customer?.email) {
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", data.customer.email)
        .single();
      userId = (profileRow as { id: string } | null)?.id ?? undefined;
    }

    if (!userId) {
      console.warn("Paddle webhook: no user_id found in event", { event_type });
      return NextResponse.json({ received: true, user_id: null });
    }

    switch (event_type) {
      case "transaction.completed": {
        await supabase
          .from("profiles")
          .update({
            plan_tier: "pro",
            subscription_status: "active",
            paddle_subscription_id: data?.subscription_id?.toString(),
            paddle_customer_id: data?.customer?.id?.toString(),
            ai_analyses_used: 0,
            ai_limit: 100,
          } as never)
          .eq("id", userId);
        break;
      }

      case "transaction.canceled": {
        await supabase
          .from("profiles")
          .update({
            subscription_status: "canceled",
          } as never)
          .eq("id", userId);
        break;
      }

      case "subscription.canceled": {
        await supabase
          .from("profiles")
          .update({
            plan_tier: "free",
            subscription_status: "canceled",
            paddle_subscription_id: null,
            ai_analyses_used: 0,
            ai_limit: 0,
          } as never)
          .eq("id", userId);
        break;
      }

      default: {
        // Unhandled event type — log but don't error
      }
    }

    return NextResponse.json({ received: true, user_id: userId });
  } catch (error) {
    console.error("Paddle webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
