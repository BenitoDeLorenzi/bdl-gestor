"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UseProjetosFinanceAnalytics } from "../api/use-get-projetos-finance-analytics";
import {
  ArrowBigDown,
  ArrowBigUp,
  CircleCheckBig,
  CircleDollarSign,
  Clock,
  Wallet,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import DottedSeparator from "@/components/dotted-separator";

interface ProjetosFinanceAnalyticsProps {
  projetoId: string;
}

const currencyFormat = (value: number) => {
  return Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const ProjetosFinanceAnalytics = ({
  projetoId,
}: ProjetosFinanceAnalyticsProps) => {
  const { data, isLoading } = UseProjetosFinanceAnalytics({
    projetoId: projetoId,
  });

  return (
    <div className="flex flex-col lg:flex-row mb-2 gap-4">
      <Card className="w-auto lg:w-full p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-600">
            <Clock className="size-5" />
            <h1 className="font-semibold">Pendente</h1>
          </div>
          <DottedSeparator />
          <div className="flex gap-4 font-semibold">
            <div className="flex gap-1">
              <ArrowBigDown className="text-red-600" />
              <span>{currencyFormat(data?.pendente.saida || 0)}</span>
            </div>
            <div className="flex gap-1">
              <ArrowBigUp className="text-green-600" />
              <span>{currencyFormat(data?.pendente.entrada || 0)}</span>
            </div>
          </div>
        </div>
      </Card>
      <Card className="w-auto lg:w-full p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-green-600">
            <CircleCheckBig className="size-5" />
            <h1 className="font-semibold">Pago</h1>
          </div>
          <DottedSeparator />
          <div className="flex gap-4 font-semibold">
            <div className="flex gap-1">
              <ArrowBigDown className="text-red-600" />
              <span>{currencyFormat(data?.pago.saida || 0)}</span>
            </div>
            <div className="flex gap-1">
              <ArrowBigUp className="text-green-600" />
              <span>{currencyFormat(data?.pago.entrada || 0)}</span>
            </div>
          </div>
        </div>
      </Card>
      <Card className="w-auto lg:w-full p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-zinc-500">
            <CircleCheckBig className="size-5" />
            <h1 className="font-semibold">Previsto</h1>
          </div>
          <DottedSeparator />
          <div className="flex gap-4 font-semibold">
            <div className="flex gap-1">
              <ArrowBigDown className="text-red-600" />
              <span>{currencyFormat(data?.previsto.custo || 0)}</span>
            </div>
            <div className="flex gap-1">
              <ArrowBigUp className="text-green-600" />
              <span>{currencyFormat(data?.previsto.saldo || 0)}</span>
            </div>
          </div>
        </div>
      </Card>
      <Card className="w-auto lg:w-full p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-500">
            <Wallet className="size-5" />
            <h1 className="font-semibold">Saldo</h1>
          </div>
          <DottedSeparator />
          <div className="flex gap-4 font-semibold">
            <span>{currencyFormat(data?.saldo.valor || 0)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
