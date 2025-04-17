import { stripe } from "@/lib/stripe";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono().delete(
  "",
  zValidator("json", z.object({ subscriptionId: z.string() })),
  async (c) => {
    const { subscriptionId } = c.req.valid("json");

    const subscription = stripe.subscriptions.cancel(subscriptionId);

    return c.json({ data: subscription });
  }
);

export default app;
