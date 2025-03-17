"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Usuarios } from "../types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UsuariosActions } from "./usuarios-actions";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export const columns: ColumnDef<Usuarios>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      const name = row.original.name;
      const email = row.original.email;

      const getInitials = (fullName: string) => {
        if (!fullName) return "";
        const names = fullName.trim().split(" ");
        const firstInitial = names[0]?.charAt(0) || "";
        const lastInitial =
          names.length > 1 ? names[names.length - 1].charAt(0) : "";
        return `${firstInitial}${lastInitial}`.toUpperCase();
      };

      return (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="">
            <span>{name}</span>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "phone",
    header: "Telefone",
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
    accessorKey: "$updatedAt",
    header: "Atualizado",
    cell: ({ row }) => {
      const date = formatDistanceToNow(new Date(row.original.$updatedAt), {
        locale: ptBR,
      });
      return <p className="truncate capitalize">{date}</p>;
    },
  },
  {
    accessorKey: "accessedAt",
    header: "Último acesso",
    cell: ({ row }) => {
      let date = "";
      const ultimoAcesso = row.original.accessedAt;

      if (ultimoAcesso) {
        date = formatDistanceToNow(new Date(row.original.accessedAt), {
          locale: ptBR,
        });
      }

      return <p className="truncate capitalize">{date}</p>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.$id;

      return (
        <UsuariosActions id={id}>
          <Button variant="ghost" className="size-8 p-0">
            <MoreVertical />
          </Button>
        </UsuariosActions>
      );
    },
  },
];
