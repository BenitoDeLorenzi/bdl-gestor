import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, AppwriteException } from "node-appwrite";
import { setCookie, deleteCookie } from "hono/cookie";

import { loginSchema, registerSchema } from "../schemas";

import { AUTH_COOKIE } from "../constants";

import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { stripe } from "@/lib/stripe";
import { STRIPE_TRIAL_PRICE_ID } from "@/config";

const app = new Hono()
  .get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");
    return c.json({ data: user });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    try {
      const { email, password } = await c.req.valid("json");
      const { account } = await createAdminClient();

      const session = await account.createEmailPasswordSession(email, password);

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({
        success: true,
        error: null,
      });
    } catch (error) {
      const typedError = error as AppwriteException;
      return c.json({
        success: false,
        error: typedError,
      });
    }
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    try {
      const { email, name, password } = c.req.valid("json");
      const { account, users } = await createAdminClient();

      const user = await account.create(ID.unique(), email, password, name);
      const session = await account.createEmailPasswordSession(email, password);
      const stripeCustomer = await stripe.customers.create({
        email,
        name,
        metadata: {
          appwrite_user_id: user.$id,
        },
      });

      await stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [{ price: STRIPE_TRIAL_PRICE_ID }],
        trial_period_days: 7,
        payment_behavior: "default_incomplete",
      });

      await users.updatePrefs(user.$id, {
        stripeCustomerId: stripeCustomer.id,
      });

      setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return c.json({ user: user, error: null });
    } catch (error) {
      console.log(error);
      const typedError = error as AppwriteException;
      return c.json({ user: null, error: typedError });
    }
  })
  .post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSession("current");

    return c.json({ success: true });
  });

export default app;
