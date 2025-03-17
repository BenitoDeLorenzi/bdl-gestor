import { Models } from "node-appwrite";
import { Contratante } from "../contratantes/types";
import { Locais } from "../locais/types";
import { Equipe } from "../equipe/types";

export type Faturamentos = Models.Document & {
  show_id: string;
  data_pagamento: string;
  valor: number;
  valor_recebido: number;
  valor_despesas: number;
  despesa_musicos: string[];
  despesas: string[];
  show?: Models.Document & {
    anotacoes: string;
    contratante: Contratante;
    data: string;
    equipe: Equipe;
    horario: string;
    local: Locais;
    projeto: string;
    status: string;
    valor: number;
  };
};
