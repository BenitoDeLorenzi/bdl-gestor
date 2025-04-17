"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup } from "@/components/ui/radio-group";
import DottedSeparator from "@/components/dotted-separator";
import { PlanCard } from "@/features/planos/components/plan-card";

import { AlertOctagon, ChevronLeft, CircleX, CreditCard } from "lucide-react";
import { StripePrice } from "../types";
import { PaymentButton } from "@/components/payment-button";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteSubscription } from "../api/use-delete-subscription";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { differenceInDays } from "date-fns";
import { STRIPE_CUSTOMER_PORTAL_URL } from "@/config";

interface PlanosViewProps {
  subscription: any;
  prices: StripePrice[];
  customerId: string;
}

export const PlanosView = ({
  prices,
  subscription,
  customerId,
}: PlanosViewProps) => {
  const { mutate, isPending } = useDeleteSubscription();

  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja cancelar essa assinatura?",
    "Essa ação não pode ser desfeita.",
    "destructive"
  );

  const paidPlans = prices.filter((price) => price.unit_amount > 0);

  const [selectedPriceId, setSelectedPriceId] = useState(subscription.plan.id);

  const selectedPrice = paidPlans.find((price) => price.id === selectedPriceId);

  const priceValue = selectedPrice
    ? (selectedPrice.unit_amount! / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    : "R$ 0,00";

  const interval =
    selectedPrice?.recurring?.interval === "year" ? "1 ano" : "30 dias";

  const handleCancelPlan = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ json: { subscriptionId: subscription.id } });
  };

  console.log(subscription);

  return (
    <div className="w-full lg:max-w-6xl relative">
      <ConfirmDialog />
      <div className="flex items-center justify-between mb-4">
        <Link href="/dashboard" className="flex gap-2">
          <ChevronLeft />
          <span>Voltar</span>
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-2xl">
          Planos
        </h1>
      </div>

      <DottedSeparator className="py-4 mb-3" />

      {subscription.status === "trialing" && (
        <Alert className="mb-4" variant="warning">
          <AlertOctagon className="size-5" />
          <AlertTitle>Avaliação gratuita</AlertTitle>
          <AlertDescription>{`Faltam ${differenceInDays(
            new Date(subscription.trial_end * 1000),
            new Date(subscription.trial_start * 1000)
          )} dias para expirar a avaliação gratuita.`}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-4 col-span-3 md:col-span-2">
          <RadioGroup
            value={selectedPriceId}
            onValueChange={setSelectedPriceId}
            className="flex flex-col gap-4"
          >
            {paidPlans.map((price) => {
              return (
                <PlanCard
                  key={price.id}
                  price={price}
                  subscription={subscription}
                  selected={selectedPriceId}
                />
              );
            })}
          </RadioGroup>
        </div>

        <div className="flex flex-col col-span-3 md:col-span-1">
          <Card>
            <div className="flex flex-col p-6">
              <div className="flex items-center justify-between">
                <span>{selectedPrice?.nickname ?? "Nenhum plano"}</span>
                <span>{priceValue}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <span>Total devido</span>
                <span>{priceValue}</span>
              </div>
              <div className="flex flex-col mt-6 gap-4">
                <p className="text-xs text-muted-foreground">{`Você pagará ${priceValue} agora. Depois, será cobrado ${priceValue} a cada ${interval}.`}</p>
                <Button
                  variant="outline"
                  icon={CreditCard}
                  iconPlacement="left"
                  asChild
                >
                  <Link href={STRIPE_CUSTOMER_PORTAL_URL || ""} target="_blank">
                    Atualizar método de pagamento
                  </Link>
                </Button>
                {selectedPriceId === subscription.plan.id &&
                subscription.status === "active" ? (
                  <Button
                    variant="destructive"
                    icon={CircleX}
                    iconPlacement="left"
                    onClick={handleCancelPlan}
                  >
                    Cancelar
                  </Button>
                ) : (
                  <PaymentButton
                    stripePriceId={selectedPriceId}
                    stripeCustomerId={customerId}
                  >
                    Assinar
                  </PaymentButton>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
