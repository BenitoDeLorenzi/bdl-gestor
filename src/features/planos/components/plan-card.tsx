"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { StripePrice } from "../types";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  subscription: any;
  price: StripePrice;
  selected: string;
}

const getSubscriptionStatusInfo = (status: string) => {
  switch (status) {
    case "trialing":
      return { label: "Avaliação", variant: "secondary" as const };
    case "active":
      return { label: "Ativo", variant: "success" as const };
    case "canceled":
      return { label: "Cancelado", variant: "destructive" as const };
    default:
      return { label: status, variant: "default" as const };
  }
};

export const PlanCard = ({ subscription, price, selected }: PlanCardProps) => {
  const currentPlan = price.id === subscription?.plan?.id;
  const isFree = price.unit_amount === 0;

  const statusInfo = currentPlan
    ? getSubscriptionStatusInfo(subscription.status)
    : null;

  return (
    <label htmlFor={price.id} className="block">
      <Card
        className={cn(
          "transition-all hover:shadow-lg hover:bg-blue-100 cursor-pointer",
          selected === price.id && "border-2 border-blue-600 bg-blue-50"
        )}
      >
        <div className="flex p-7 gap-5 items-center">
          <RadioGroupItem value={price.id} id={price.id} disabled={false} />
          <div className="flex flex-col flex-1 gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <CardTitle>{price.nickname}</CardTitle>
              {currentPlan && (
                <>
                  <Badge variant="outline">Plano atual</Badge>
                  <Badge variant={statusInfo?.variant}>
                    {statusInfo?.label}
                  </Badge>
                </>
              )}
            </div>
            <h1 className="font-semibold">
              {isFree
                ? "Gratuito"
                : `${(price.unit_amount / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })} / ${
                    price.recurring?.interval === "year" ? "ano" : "mês"
                  }`}
            </h1>
          </div>
        </div>
      </Card>
    </label>
  );
};
