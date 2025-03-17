"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UseProjetosFinanceAnalytics } from "../api/use-get-projetos-finance-analytics";
import { ArrowBigDown, ArrowBigUp, CircleDollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjetosFinanceAnalyticsProps {
  projetoId: string;
}

export const ProjetosFinanceAnalytics = ({
  projetoId,
}: ProjetosFinanceAnalyticsProps) => {
  const { data, isLoading } = UseProjetosFinanceAnalytics({
    projetoId: projetoId,
  });

  return (
    <div className="flex flex-col lg:flex-row py-4 gap-4">
      <Card className="w-full">
        <CardHeader className="py-2">
          <div className="flex items-center justify-between">
            <CardTitle>Entradas</CardTitle>
            <CardDescription className="text-lg font-semibold">
              {data?.entradas.total}
            </CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="py-2">
          {isLoading ? (
            <Skeleton className="h-7" />
          ) : (
            <div className="flex items-center gap-2">
              <ArrowBigUp className="text-green-500" />
              <h1 className="text-xl font-semibold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(data?.entradas.valor || 0)}
              </h1>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="py-2">
          <div className="flex items-center justify-between">
            <CardTitle>Saidas</CardTitle>
            <CardDescription className="text-lg font-semibold">
              {data?.saidas.total}
            </CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="py-2">
          {isLoading ? (
            <Skeleton className="h-7" />
          ) : (
            <div className="flex items-center gap-2">
              <ArrowBigDown className="text-red-500" />
              <h1 className="text-xl font-semibold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(data?.saidas.valor || 0)}
              </h1>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="py-2">
          <div className="flex items-center justify-between">
            <CardTitle>Saldo</CardTitle>
            <CardDescription className="text-lg font-semibold">
              {data?.saldo.total}
            </CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="py-2">
          {isLoading ? (
            <Skeleton className="h-7" />
          ) : (
            <div className="flex items-center gap-2">
              <CircleDollarSign className="text-blue-500" />
              <h1 className="text-xl font-semibold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(data?.saldo.valor || 0)}
              </h1>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
