"use client";

import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    Paddle: {
      Initialize: (options: { token: string }) => void;
      Checkout: {
        open: (options: {
          items: { priceId: string; quantity: number }[];
          customData?: Record<string, string>;
          successCallback?: (data: unknown) => void;
          closeCallback?: (data: unknown) => void;
        }) => void;
      };
    };
  }
}

let initialized = false;

export function initPaddle() {
  if (initialized) return;
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) {
    console.warn("Paddle client token not configured");
    return;
  }

  if (typeof window !== "undefined" && !window.Paddle) {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v1/paddle.js";
    script.async = true;
    script.onload = () => {
      window.Paddle.Initialize({ token });
      initialized = true;
    };
    document.body.appendChild(script);
  } else if (window.Paddle) {
    window.Paddle.Initialize({ token });
    initialized = true;
  }
}

export async function openPaddleCheckout(priceId: string, userId: string) {
  if (!window.Paddle) {
    console.error("Paddle not loaded");
    return;
  }

  window.Paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customData: { user_id: userId },
    successCallback: async () => {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({ plan_tier: "pro" } as never)
        .eq("id", userId)
        .select();
      window.location.reload();
    },
  });
}
