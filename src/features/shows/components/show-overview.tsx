import { Button } from "@/components/ui/button";
import { Shows } from "../types";
import { PencilIcon } from "lucide-react";
import DottedSeparator from "@/components/dotted-separator";
import { OverviewProperty } from "./overview-property";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEditShowModal } from "../hooks/use-edit-show-modal";
import { Equipe } from "@/features/equipe/types";

interface ShowOverviewProps {
  show: Shows;
}

export const ShowOverview = ({ show }: ShowOverviewProps) => {
  const { open } = useEditShowModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Visão geral</p>
          <Button size="sm" variant="secondary" onClick={() => open(show.$id)}>
            <PencilIcon className="size-4 mr-2" />
            Editar
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Status">
            <Badge variant={show.status}>
              {snakeCaseToTitleCase(show.status)}
            </Badge>
          </OverviewProperty>
          <OverviewProperty label="Contratante">
            <h1 className="text-sm">
              {typeof show.contratante === "string"
                ? show.contratante
                : show.contratante.nome}
            </h1>
          </OverviewProperty>
          <OverviewProperty label="Local">
            <h1 className="text-sm">
              {typeof show.local === "string" ? show.local : show.local.nome}
            </h1>
          </OverviewProperty>
          <OverviewProperty label="Data">
            <h1 className="text-sm">
              {format(new Date(show.data), "PPP", { locale: ptBR })}
            </h1>
          </OverviewProperty>
          <OverviewProperty label="Horário">
            <h1 className="text-sm">
              {format(new Date(show.horario), "kk:mm", { locale: ptBR })}
            </h1>
          </OverviewProperty>
          <OverviewProperty label="Endereço">
            <h1 className="text-sm">
              {typeof show.local === "string"
                ? show.local
                : `${show.local.logradouro} - ${show.local.cidade} / ${show.local.uf}`}
            </h1>
          </OverviewProperty>
          <DottedSeparator />
          <OverviewProperty label="Equipe">
            <div className="flex flex-col w-full text-sm gap-y-2">
              {(show.equipe as Equipe[]).map((membro) => (
                <div key={membro.$id} className="flex items-center gap-x-2">
                  <p>{membro.nome}</p>-<p>{membro.funcao}</p>-
                  <p>{membro.instrumento}</p>
                </div>
              ))}
            </div>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
