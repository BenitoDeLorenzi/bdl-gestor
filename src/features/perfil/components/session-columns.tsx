"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";

import { Models } from "node-appwrite";
import { SessionsActions } from "./sessions-actions";
import { Monitor, Smartphone } from "lucide-react";

export const sessionColumns: ColumnDef<Models.Session>[] = [
  {
    accessorKey: "osName",
    header: "Navegador e Dispositivo",
    cell: ({ row }) => {
      const osName = row.original.osName;
      const osVersion = row.original.osVersion;
      const deviceName = row.original.deviceName;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              {deviceName === "desktop" ? <Monitor /> : <Smartphone />}
            </AvatarFallback>
          </Avatar>
          <span className="capitalizept">{`${osName} ${osVersion}`}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "countryName",
    header: "Localização",
  },
  {
    accessorKey: "ip",
    header: "IP",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sessionId = row.original.$id;
      const userId = row.original.userId;

      return <SessionsActions sessionId={sessionId} userId={userId} />;
    },
  },
];
