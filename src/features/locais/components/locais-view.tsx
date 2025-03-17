"use client";

import { Loader } from "lucide-react";
import { useGetLocais } from "../api/use-get-locais";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const LocaisView = () => {
  const { data: locais, isLoading: isLoadingLocais } = useGetLocais();

  return (
    <div className="flex-1 w-full border rounded-md">
      <div className="h-full flex flex-col overflow-auto p-4">
        {isLoadingLocais ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DataTable columns={columns} data={locais?.documents || []} />
        )}
      </div>
    </div>
  );
};
