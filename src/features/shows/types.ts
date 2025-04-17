import { Models } from "node-appwrite";
import { Contratante } from "../contratantes/types";
import { Locais } from "../locais/types";
import { Equipe } from "../equipe/types";

export enum ShowStatus {
  PENDENTE = "PENDENTE",
  CONFIRMADO = "CONFIRMADO",
  FINALIZADO = "FINALIZADO",
}

export type Shows = Models.Document & {
  status: ShowStatus;
  valor: number;
  projeto: string;
  contratante: string | Contratante;
  local: string | Locais;
  equipe: string[] | Equipe[];
  data: string;
  horario: string;
  anotacoes?: string;
  google_event_id?: string;
};

export type Show = Models.Document & {
  status: ShowStatus;
  valor: number;
  projeto: string;
  contratante: string;
  local: string;
  equipe: string[];
  data: string;
  horario: string;
  anotacoes?: string;
  google_event_id?: string;
};
