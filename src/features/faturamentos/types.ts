import { Models } from "node-appwrite";
import { Shows } from "../shows/types";

export type Faturamentos = Models.Document & {
  show_id: string;
  data_pagamento: string;
  valor: number;
  valor_recebido: number;
  valor_despesas: number;
  despesa_musicos: string[];
  despesas: string[];
  show?: Shows;
};
