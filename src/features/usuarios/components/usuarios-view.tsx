"use client";

import { Loader } from "lucide-react";
import { useGetUsuarios } from "../api/use-get-usuarios";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const UsuariosView = () => {
  const { data: usuarios, isLoading: isLoadingUsuarios } = useGetUsuarios();

  console.log(usuarios?.users);

  return (
    <div className="flex-1 w-full border rounded-md">
      <div className="h-full flex flex-col overflow-auto p-4">
        {isLoadingUsuarios ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <DataTable columns={columns} data={usuarios?.users || []} />
        )}
      </div>
    </div>
  );
};
