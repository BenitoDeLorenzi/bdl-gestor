"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { MoreVertical } from "lucide-react";
import { Tipos } from "../types";
import { TiposActions } from "./tipos-actions";

export const columns: ColumnDef<Tipos>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.$id;

      return (
        <TiposActions id={id}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical />
          </Button>
        </TiposActions>
      );
    },
  },
];
