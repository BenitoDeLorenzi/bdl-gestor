import { Models } from "node-appwrite";

export type Locais = Models.Document & {
  nome: string;
  cep: string;
  uf: string;
  cidade: string;
  logradouro: string;
  numero: string;
  tipo: string;
  anotacoes: string;
};
