import { cn } from "@/lib/utils";
import { ShowStatus } from "../types";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface EventCardProps {
  id: string;
  title: string;
  status: ShowStatus;
  horario: string;
  contratante: string;
}

const statusColorMap: Record<ShowStatus, string> = {
  [ShowStatus.PENDENTE]: "border-l-amber-400",
  [ShowStatus.CONFIRMADO]: "border-l-blue-400",
  [ShowStatus.FINALIZADO]: "border-l-green-400",
};

export const EventCard = ({
  contratante,
  horario,
  id,
  status,
  title,
}: EventCardProps) => {
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    router.push(`/shows/${id}`);
  };

  return (
    <div className="px-2 ">
      <div
        onClick={onClick}
        className={cn(
          "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-70 transition",
          statusColorMap[status]
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{title}</p>
          <div className="flex items-center justify-center gap-2">
            <Clock className="size-4" />
            <p className="text-xs font-semibold">{horario}</p>
          </div>
        </div>
        <span className="text-[11px]">{contratante}</span>
      </div>
    </div>
  );
};
