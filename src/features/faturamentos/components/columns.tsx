"use client";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Faturamentos } from "../types";
import { FaturamentoActions } from "./faturamento-actions";

export const columns: ColumnDef<Faturamentos>[] = [
  {
    accessorKey: "show.contratante.nome",
    header: "Contratante",
  },
  {
    accessorKey: "show.local.nome",
    header: "Local",
  },
  {
    accessorKey: "valor",
    header: "Valor show",
    cell: ({ row }) => {
      const valor = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(row.original.valor);
      return <p className="truncate">{valor}</p>;
    },
  },
  {
    accessorKey: "valor_recebido",
    header: "Valor recebido",
    cell: ({ row }) => {
      const valor = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(row.original.valor_recebido);
      return <p className="truncate">{valor}</p>;
    },
  },
  {
    accessorKey: "valor_despesas",
    header: "Valor despesas",
    cell: ({ row }) => {
      const valor = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(row.original.valor_despesas);
      return <p className="truncate">{valor}</p>;
    },
  },
  {
    accessorKey: "data_pagamento",
    header: "Data pagamento",
    cell: ({ row }) => {
      const data = format(row.original.data_pagamento, "dd/MM/yyyy", {
        locale: ptBR,
      });
      return <p className="truncate capitalize">{data}</p>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.$id;
      const showId = row.original.show_id;

      return <FaturamentoActions id={id} showId={showId} />;
    },
  },
];
