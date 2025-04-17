import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { NEXT_PUBLIC_APP_URL } from "@/config";

export async function POST(req: NextRequest) {
  const origin = headers().get("origin") ?? NEXT_PUBLIC_APP_URL;

  const body = await req.json();
  const { stripePriceId, stripeCustomerId } = body;

  if (!stripePriceId || !stripeCustomerId) {
    return NextResponse.json(
      { error: "stripePriceId e stripeCustomerId são obrigatórios" },
      { status: 400 }
    );
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "all",
      limit: 5,
    });

    const activeSubscription = subscriptions.data.find(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );

    if (activeSubscription) {
      await stripe.subscriptions.cancel(activeSubscription.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      ui_mode: "embedded",
      line_items: [
        {
          quantity: 1,
          price: stripePriceId,
        },
      ],
      mode: "subscription",
      payment_method_types: ["card"],
      return_url: `${origin}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar sessão" },
      { status: 400 }
    );
  }
}
