import "server-only";

import { STRIPE_PRODUCT_ID, STRIPE_SECRET_KEY } from "@/config";

import Stripe from "stripe";

import { StripePrice } from "@/features/planos/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! || "");

export const getProductPrices = async (): Promise<StripePrice[]> => {
  const response = await stripe.prices.list({
    product: STRIPE_PRODUCT_ID,
    active: true,
    expand: ["data.product"],
  });

  const prices = response.data as StripePrice[];

  return prices.sort((a, b) => a.created - b.created);
};

export const fetchSubscriptionByCustomerId = async (
  stripeCustomerId: string,
  status?: Stripe.SubscriptionListParams.Status // tipagem oficial
) => {
  if (!stripeCustomerId) return null;

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: status ?? "all", // se não passar, busca todos
    limit: 1,
  });

  return subscriptions.data[0] ?? null;
};

export const translateSubscriptionInterval = (interval: string) => {
  switch (interval) {
    case "month":
      return "Mensal";
    case "year":
      return "Anual";
    default:
      return interval;
  }
};
