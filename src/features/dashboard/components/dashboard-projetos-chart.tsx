"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { TriangleAlert } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

interface DashboardProjetosChartProps {
  projetos: { projeto: string; count: number; fill: string }[];
  year: string;
  isLoading: boolean;
}

export const DashboardProjetosChart = ({
  projetos,
  year,
  isLoading,
}: DashboardProjetosChartProps) => {
  const chartData = projetos;

  const chartConfig = {
    count: {
      label: "Quantidade",
    },
    acustico: {
      label: "Acústico",
    },
    banda_completa: {
      label: "Banda Completa",
    },
    banda_reduzida: {
      label: "Banda Reduzida",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Projetos</CardTitle>
        <CardDescription className="text-center">{`Janeiro - Dezembro ${year}`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full h-full p-0">
        {isLoading ? (
          <div className="flex flex-col h-full items-center justify-center p-8">
            <Skeleton className="w-[250px] h-[250px] rounded-full" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="flex flex-col w-full h-full"
          >
            {projetos.length > 0 ? (
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="count" hideLabel />}
                />
                <Pie data={chartData} dataKey="count">
                  <LabelList
                    dataKey="projeto"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: keyof typeof chartConfig) =>
                      chartConfig[value]?.label
                    }
                  />
                </Pie>
              </PieChart>
            ) : (
              <div className="flex flex-col w-full h-full items-center justify-center text-muted-foreground gap-4">
                <TriangleAlert className="size-10" />
                <h1>Sem dados para esse ano.</h1>
              </div>
            )}
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
