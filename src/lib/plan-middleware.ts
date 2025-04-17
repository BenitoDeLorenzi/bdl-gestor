import { createMiddleware } from "hono/factory";
import { Models } from "node-appwrite";
import { Databases } from "node-appwrite";
import { stripe } from "./stripe";

type PlanContext = {
  Variables: {
    user: Models.User<Models.Preferences>;
    databases: Databases;
  };
};

export const planMiddleware = createMiddleware<PlanContext>(async (c, next) => {
  const user = c.get("user");
  const stripeCustomerId = user.prefs?.stripeCustomerId;

  if (!stripeCustomerId) {
    return c.json({ error: "Acesso bloqueado. Nenhum plano ativo." }, 403);
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: stripeCustomerId,
    status: "all",
    limit: 1,
  });

  const subscription = subscriptions.data[0];

  const isValid =
    subscription &&
    (subscription.status === "active" || subscription.status === "trialing");

  if (!isValid) {
    return c.json({ error: "Seu plano expirou ou foi cancelado." }, 403);
  }

  await next();
});
