"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ArrowBigDown, ArrowBigUp, MoreVertical } from "lucide-react";
import {
  formaPagamentoLabels,
  ProjetosFinance,
  ProjetosFinanceFormaPagamento,
} from "../types";

import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProjetosFinanceActions } from "./projetos-finance-actions";

export const projetosFinanceColumns: ColumnDef<ProjetosFinance>[] = [
  {
    accessorKey: "descricao",
    header: "Descrição",
    cell: ({ row }) => {
      const descricao = row.original.descricao;
      const obecervacoes = row.original.obecervacoes;

      return (
        <div className="">
          <h1>{descricao}</h1>
          <p className="text-xs text-muted-foreground">{obecervacoes}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "forma_pagamento",
    header: "Forma de pagamento",
    cell: ({ row }) => {
      const formaPagamento = row.original
        .forma_pagamento as ProjetosFinanceFormaPagamento;
      return formaPagamentoLabels[formaPagamento] || "Desconhecido"; // Fallback caso seja um valor inesperado
    },
  },
  {
    accessorKey: "data",
    header: "Data pagamento",
    cell: ({ row }) => {
      const data = format(new Date(row.original.data), "dd/MM/yyyy");

      return data;
    },
  },
  {
    accessorKey: "valor",
    header: "Valor",
    cell: ({ row }) => {
      const valor = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(row.original.valor);

      const tipo = row.original.tipo;

      const icon =
        tipo === "ENTRADA" ? (
          <ArrowBigUp className="text-green-500" />
        ) : (
          <ArrowBigDown className="text-red-500" />
        );

      return (
        <div className="flex items-center gap-2">
          {icon}
          <p className="font-semibold">{valor}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          className={cn(
            status === "PENDENTE"
              ? "bg-amber-500 hover:bg-amber-500/80"
              : status === "PAGO"
              ? "bg-green-500 hover:bg-green-500/80"
              : "bg-red-500 hover:bg-red-500/80"
          )}
        >
          {status}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.$id;

      return (
        <ProjetosFinanceActions id={id}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical />
          </Button>
        </ProjetosFinanceActions>
      );
    },
  },
];
