"use client";

import { Loader } from "lucide-react";
import { useGetContratantes } from "../api/use-get-contratantes";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const ContratantesView = () => {
  const { data: contratantes, isLoading: isLoadingContratantes } =
    useGetContratantes();

  return (
    <div className="flex-1 w-full border rounded-md">
      <div className="h-full flex flex-col overflow-auto p-4">
        {isLoadingContratantes ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DataTable columns={columns} data={contratantes?.documents || []} />
        )}
      </div>
    </div>
  );
};
