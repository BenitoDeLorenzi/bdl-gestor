import { Models } from "node-appwrite";

export type Contratante = Models.Document & {
  nome: string;
  telefone: string;
  email: string;
  anotacoes: string;
};
