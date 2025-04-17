import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface FaturamentoAnalyticsCardProps {
  title: string;
  porcentagem: number;
  valorAtual: number;
  valorAnterior: number;
  anoAnterior: number;
  bgColor?: string;
}

export const FaturamentoAnalyticsCard = ({
  porcentagem,
  title,
  valorAtual,
  valorAnterior,
  anoAnterior,
  bgColor = "bg-gray-100", // valor padrão
}: FaturamentoAnalyticsCardProps) => {
  return (
    <Card className={cn(bgColor, "w-full")}>
      <div className="flex flex-col p-2 bg-white rounded-xl ml-2 h-full">
        <div className="flex w-full items-center justify-between text-muted-foreground text-sm">
          <span>{title}</span>
          <Badge variant="outline" className="gap-2">
            {porcentagem < 0 ? (
              <TrendingDown className="size-4" />
            ) : (
              <TrendingUp className="size-4" />
            )}
            {`${porcentagem}%`}
          </Badge>
        </div>
        <h1 className="font-semibold text-lg">
          {formatCurrency(valorAtual || 0)}
        </h1>
        <div className="flex flex-col mt-3 text-sm text-muted-foreground">
          <span>{`${anoAnterior} - ${formatCurrency(valorAnterior)}`}</span>
        </div>
      </div>
    </Card>
  );
};
