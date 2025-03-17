"use client";

import { Card } from "@/components/ui/card";
import { useGetPerfilSessoes } from "../api/use-get-sessoes";
import { sessionColumns } from "./session-columns";
import { SessionsDataTable } from "./sessions-data-table";
import { Loader } from "lucide-react";

interface PerfilSessoesViewProps {
  userId: string;
}

export const PerfilSessoesView = ({ userId }: PerfilSessoesViewProps) => {
  const { data, isLoading } = useGetPerfilSessoes({ userId: userId });

  console.log(data);

  return (
    <Card className="p-2">
      {isLoading ? (
        <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <SessionsDataTable
          columns={sessionColumns}
          data={data?.sessions || []}
        />
      )}
    </Card>
  );
};
