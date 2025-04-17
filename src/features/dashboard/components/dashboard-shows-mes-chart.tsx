"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

interface DashboardShowsMesChartProps {
  total: number;
  showsMensais: {
    mes: string;
    count: number;
  }[];
  isLoading: boolean;
}

export const DashboardShowsMesChart = ({
  showsMensais,
  isLoading,
  total,
}: DashboardShowsMesChartProps) => {
  const chartData = showsMensais;

  const chartConfig = {
    count: {
      label: "Shows",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shows</CardTitle>
        </div>
        <CardDescription>{`Total: ${total}`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col w-full h-full">
        {isLoading ? (
          <div className="flex flex-col w-full h-full">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="flex flex-col w-full h-[300px] p-4"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mes"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};
