"use client";

import { Loader } from "lucide-react";

import { useGetEquipe } from "../api/use-get-equipe";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export const EquipeView = () => {
  const { data: equipe, isLoading: isLoadingEquipe } = useGetEquipe();

  return (
    <div className="flex-1 w-full border rounded-md">
      <div className="h-full flex flex-col overflow-auto p-4">
        {isLoadingEquipe ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DataTable columns={columns} data={equipe?.documents || []} />
        )}
      </div>
    </div>
  );
};
