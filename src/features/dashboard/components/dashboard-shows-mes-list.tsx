import DottedSeparator from "@/components/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Shows } from "@/features/shows/types";
import { format } from "date-fns";
import {
  CircleAlert,
  CircleCheck,
  CircleDotDashed,
  Clock,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

interface DashboardShowsMesListProps {
  shows: Shows[];
  total: number;
  isLoading: boolean;
}

export const DashboardShowsMesList = ({
  shows,
  total,
  isLoading,
}: DashboardShowsMesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shows do mês</CardTitle>
        <CardDescription>{`Total: ${total}`}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-1 min-h-[300px] flex-1">
        <DottedSeparator className="mb-2" />
        {isLoading ? (
          <div className="flex flex-col w-full h-full gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-12" />
            ))}
          </div>
        ) : shows.length === 0 ? (
          <div className="flex flex-col flex-1 items-center justify-center text-muted-foreground gap-4">
            <TriangleAlert className="size-10" />
            <h1 className="font-semibold">Sem shows para esse mês.</h1>
          </div>
        ) : (
          shows.map((show) => {
            const local =
              typeof show.local === "string"
                ? show.local
                : show.local?.nome || "Sem nome";

            const contratante =
              typeof show.contratante === "string"
                ? show.contratante
                : show.contratante?.nome || "Sem nome";

            const icon =
              show.status === "PENDENTE" ? (
                <Clock className="text-amber-500 size-5" />
              ) : show.status === "CONFIRMADO" ? (
                <CircleDotDashed className="text-blue-500 size-5" />
              ) : show.status === "FINALIZADO" ? (
                <CircleCheck className="text-green-500 size-5" />
              ) : (
                <CircleAlert className="text-gray-400 size-5" />
              );

            return (
              <Link
                key={show.$id}
                href={`/dashboard/shows/${show.$id}`}
                className="flex flex-col hover:bg-gray-100 rounded-md p-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {icon}
                    <div className="flex flex-col">
                      <span className="font-semibold">{local}</span>
                      <span className="text-xs text-muted-foreground">
                        {contratante}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="font-semibold">
                      {format(new Date(show.data), "dd/MM/yyyy")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(show.valor || 0)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
