"use client";

import { Loader } from "lucide-react";
import { useGetTipos } from "../api/use-get-tipos";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TiposProps } from "../types";

export const TiposView = ({ tipo }: TiposProps) => {
  const { data, isLoading } = useGetTipos({ tipo: tipo });

  return (
    <div className="flex-1 w-full border rounded-md">
      <div className="h-full flex flex-col overflow-auto p-4">
        {isLoading ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data?.documents || []}
            tipo={tipo}
          />
        )}
      </div>
    </div>
  );
};
