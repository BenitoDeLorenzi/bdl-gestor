import { Models } from "node-appwrite";

export type Tipos = Models.Document & {
  tipo: string;
  nome: string;
};
