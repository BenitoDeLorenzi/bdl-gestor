"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { MoreVertical, User } from "lucide-react";

import { mask } from "remask";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Equipe } from "../types";
import { EquipeActions } from "./equipe-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<Equipe>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          <span>{row.original.nome}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "funcao",
    header: "Função",
  },
  {
    accessorKey: "instrumento",
    header: "Instrumento",
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
    accessorKey: "cache_medio",
    header: "Cache médio",
    cell: ({ row }) => {
      const cache = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(parseInt(row.original.cache_medio));
      return <p className="truncate capitalize">{cache}</p>;
    },
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
        <EquipeActions id={id}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical />
          </Button>
        </EquipeActions>
      );
    },
  },
];
