import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

const colorVariants = {
  amber: { bg: "bg-amber-200", text: "text-amber-700" },
  blue: { bg: "bg-blue-200", text: "text-blue-700" },
  green: { bg: "bg-green-200", text: "text-green-700" },
  gray: { bg: "bg-gray-200", text: "text-gray-700" },
} as const;

interface DashboardAnalyticsCardProps {
  title: string;
  icon: LucideIcon;
  value: number;
  color: keyof typeof colorVariants;
  total: number;
  isLoading: boolean;
}

export const DashboardAnalyticsCard = ({
  title,
  icon: Icon,
  value,
  color,
  total = 0,
  isLoading = true,
}: DashboardAnalyticsCardProps) => {
  const { bg, text } = colorVariants[color] || colorVariants.gray;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarFallback
              className={cn(bg, text, "flex items-center justify-center")}
            >
              <Icon className={cn("h-7 w-7")} />
            </AvatarFallback>
          </Avatar>
          <h1 className="font-semibold">{title}</h1>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-1">
            <Skeleton className="h-7" />
            <Skeleton className="h-4" />
          </div>
        ) : (
          <>
            <h1 className="font-semibold text-xl">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value)}
            </h1>
            <p className="text-sm text-muted-foreground">{`Total de shows: ${total}`}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};
