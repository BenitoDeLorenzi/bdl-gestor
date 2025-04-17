"use client";

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "@/config";

import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { CircleCheck } from "lucide-react";

interface PaymentButtonProps {
  children: React.ReactNode;
  stripePriceId: string;
  stripeCustomerId: string;
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY ?? "");

export const PaymentButton = ({
  children,
  stripePriceId,
  stripeCustomerId,
}: PaymentButtonProps) => {
  const fetchClientSecret = useCallback(() => {
    return fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stripePriceId, stripeCustomerId }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro na requisição ao Stripe");
        }
        return res.json();
      })
      .then((data) => {
        if (!data?.client_secret) {
          throw new Error("client_secret não encontrado");
        }
        return data.client_secret;
      });
  }, [stripePriceId]);

  const options = { fetchClientSecret };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" icon={CircleCheck} iconPlacement="left">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby=""
        className="w-full sm:max-w-xl border-none overflow-y-auto hide-scrollbar max-h-[95vh]"
      >
        <DialogTitle>Assinar plano</DialogTitle>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </DialogContent>
    </Dialog>
  );
};
