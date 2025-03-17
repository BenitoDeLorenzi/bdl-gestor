"use client";

import { Loader } from "lucide-react";
import { useGetFaturamentos } from "../api/use-get-faturamento";
import { useGetShows } from "@/features/shows/api/use-get-shows";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Faturamentos } from "../types";

export const FaturamentosView = () => {
  const { data: faturamentos, isLoading: isLoadingFaturamentos } =
    useGetFaturamentos();
  const { data: shows, isLoading: isLoadingShows } = useGetShows({});

  const populatedFaturamentos: Faturamentos[] =
    faturamentos?.documents.map((faturamento) => {
      const showDetails = shows?.documents.find(
        (show) => show.$id === faturamento.show_id
      );

      return {
        ...faturamento,
        show: showDetails
          ? ({
              ...showDetails,
              contratante:
                typeof showDetails.contratante === "string"
                  ? ({} as any)
                  : showDetails.contratante,
              local:
                typeof showDetails.local === "string"
                  ? ({} as any)
                  : showDetails.local,
              equipe:
                typeof showDetails.equipe === "string"
                  ? ({} as any)
                  : showDetails.equipe,
            } as Faturamentos["show"])
          : undefined, // Se não encontrar o show, `show` será undefined
      };
    }) || [];

  const isLoading = isLoadingFaturamentos || isLoadingShows;

  return (
    <div className="flex-1 w-full border rounded-md">
      <div className="h-full flex flex-col overflow-auto p-4">
        {isLoading ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DataTable columns={columns} data={populatedFaturamentos} />
        )}
      </div>
    </div>
  );
};
