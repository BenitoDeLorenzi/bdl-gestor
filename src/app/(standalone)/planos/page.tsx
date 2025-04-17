import { redirect } from "next/navigation";

import { fetchSubscriptionByCustomerId, getProductPrices } from "@/lib/stripe";

import { getCurrent } from "@/features/auth/queries";
import { PlanosView } from "@/features/planos/components/planos-view";

const PlanosPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/");

  const customerId = user.prefs.stripeCustomerId;
  const prices = await getProductPrices();
  const subscription = await fetchSubscriptionByCustomerId(customerId, "all");

  return (
    <PlanosView
      prices={prices}
      subscription={subscription}
      customerId={customerId}
    />
  );
};

export default PlanosPage;
