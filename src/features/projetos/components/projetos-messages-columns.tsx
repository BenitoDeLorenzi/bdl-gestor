"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { ProjetosMessages } from "../types";

import { ProjetosFinanceActions } from "./projetos-finance-actions";

export const projetosMessagesColumns: ColumnDef<ProjetosMessages>[] = [
  {
    accessorKey: "razao_social",
    header: "Razão Social",
    cell: ({ row }) => {
      const razaoSocial = row.original.razao_social;
      const cnpj = row.original.cnpj;
      return (
        <div className="flex flex-col">
          <span>{razaoSocial}</span>
          <p className="text-xs font-semibold text-muted-foreground">{cnpj}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "representante_nome",
    header: "Representante",
    cell: ({ row }) => {
      const representante = row.original.representante_nome;
      const cpf = row.original.representante_cpf;
      return (
        <div className="flex flex-col">
          <span>{representante}</span>
          <p className="text-xs font-semibold text-muted-foreground">{cpf}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "endereco",
    header: "Endereco",
    cell: ({ row }) => {
      const cidade = row.original.cidade;
      const uf = row.original.uf;
      const logradouro = row.original.logradouro;
      return (
        <div className="flex flex-col">
          <span>{`${cidade} / ${uf}`}</span>
          <p className="text-xs font-semibold text-muted-foreground">
            {logradouro}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "box",
    header: "Box",
    cell: ({ row }) => {
      const box = row.original.box.join(" - ");

      return box;
    },
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const id = row.original.$id;

  //     return (
  //       <ProjetosFinanceActions id={id}>
  //         <Button variant="ghost" className="size-8 p-0">
  //           <MoreVertical />
  //         </Button>
  //       </ProjetosFinanceActions>
  //     );
  //   },
  // },
];
