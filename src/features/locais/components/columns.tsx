"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Locais } from "../types";
import { LocaisActions } from "./locais-actions";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const columns: ColumnDef<Locais>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "cidade",
    header: "Cidade",
    cell: ({ row }) => {
      const cidade = row.original.cidade;
      const uf = row.original.uf;
      return <p className="truncate">{`${cidade} / ${uf}`}</p>;
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
  {
    accessorKey: "$createdAt",
    header: "Criado",
    cell: ({ row }) => {
      const date = formatDistanceToNow(new Date(row.original.$createdAt), {
        locale: ptBR,
      });
      return <p className="truncate capitalize">{date}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.$id;

      return (
        <LocaisActions id={id}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical />
          </Button>
        </LocaisActions>
      );
    },
  },
];
