"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Contratante } from "../types";
import { mask } from "remask";
import { ContratantesActions } from "./contratantes-actions";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const columns: ColumnDef<Contratante>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
    cell: ({ row }) => {
      const pattern = ["(99) 9999-9999", "(99) 99999-9999"];
      const telefone = mask(row.original.telefone, pattern);
      return <p className="truncate">{telefone}</p>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
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
        <ContratantesActions id={id}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical />
          </Button>
        </ContratantesActions>
      );
    },
  },
];
