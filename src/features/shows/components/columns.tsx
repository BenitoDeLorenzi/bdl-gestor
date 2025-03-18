"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown, BadgeCheck, Circle, MoreVertical } from "lucide-react";

import { Show, Shows } from "../types";
import { Button } from "@/components/ui/button";

import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn, snakeCaseToTitleCase } from "@/lib/utils";
import { ShowsActions } from "./shows-actions";
import { useSidebar } from "@/components/ui/sidebar";

export const columns: ColumnDef<Shows>[] = [
  {
    accessorKey: "contratante",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contratante
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const contratante =
        typeof row.original.contratante === "string"
          ? row.original.contratante
          : row.original.contratante.nome;

      return contratante;
    },
  },
  {
    accessorKey: "local",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Local
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { isMobile } = useSidebar();
      const data = format(row.original.data, "dd/MM/yyyy", { locale: ptBR });
      const status = row.original.status;
      const local =
        typeof row.original.local === "string"
          ? row.original.local
          : row.original.local.nome;

      return (
        <div className="flex items-center gap-2">
          {isMobile && (
            <BadgeCheck
              className={cn(
                "size-5 stroke-white",
                status === "PENDENTE"
                  ? "fill-amber-500"
                  : status === "CONFIRMADO"
                  ? "fill-blue-500"
                  : status === "FINALIZADO"
                  ? "fill-green-500"
                  : "fill-gray-500"
              )}
            />
          )}
          <div className="flex flex-col">
            <span>{local}</span>
            {isMobile && (
              <p className="text-xs text-muted-foreground">{data}</p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "cidade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cidade
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const cidade =
        typeof row.original.local === "string"
          ? row.original.local
          : row.original.local.cidade;

      return cidade;
    },
  },
  {
    accessorKey: "projeto",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Projeto
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const projeto = snakeCaseToTitleCase(row.original.projeto);
      return <p className="truncate">{projeto}</p>;
    },
  },
  {
    accessorKey: "data",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = format(row.original.data, "PPP", { locale: ptBR });
      return <p className="truncate">{data}</p>;
    },
  },
  {
    accessorKey: "horario",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Horário
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const horario = format(row.original.horario, "HH:mm");
      return <p className="truncate">{horario}</p>;
    },
  },
  {
    accessorKey: "valor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const valor = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(row.original.valor);
      return <p className="truncate">{valor}</p>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { isMobile } = useSidebar();
      const status = row.original.status;

      return <Badge variant={status}>{snakeCaseToTitleCase(status)}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.$id;
      const status = row.original.status;

      return (
        <ShowsActions id={id} status={status}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical />
          </Button>
        </ShowsActions>
      );
    },
  },
];
