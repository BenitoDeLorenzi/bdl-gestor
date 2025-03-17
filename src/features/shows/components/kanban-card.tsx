import { CalendarDays, Clock, MoreHorizontalIcon, Wallet } from "lucide-react";
import { Shows } from "../types";
import { ShowsActions } from "./shows-actions";
import DottedSeparator from "@/components/dotted-separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface KanbanCardProps {
  show: Shows;
}

export const KanbanCard = ({ show }: KanbanCardProps) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex flex-col">
          <p className="text-sm line-clamp-2">
            {`${
              typeof show.local === "string" ? show.local : show.local.nome
            } - ${
              typeof show.local === "string" ? show.local : show.local.cidade
            }`}
          </p>
          <span className="text-muted-foreground text-xs line-clamp-3">
            {typeof show.contratante === "string"
              ? show.contratante
              : show.contratante.nome}
          </span>
        </div>
        <ShowsActions id={show.$id} status={show.status}>
          <MoreHorizontalIcon className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
        </ShowsActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center justify-between gap-x-1.5 text-xs">
        <div className="flex items-center justify-center p-1.5 gap-2">
          <CalendarDays className="size-4" />
          {format(new Date(show.data), "PPP", { locale: ptBR })}
        </div>
        <div className="flex items-center justify-center p-1.5 gap-2">
          <Clock className="size-4" />
          {format(new Date(show.horario), "kk:mm")}
        </div>
        <div className="flex items-center justify-center p-1.5 gap-2">
          <Wallet className="size-4" />
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(show.valor)}
        </div>
      </div>
    </div>
  );
};
