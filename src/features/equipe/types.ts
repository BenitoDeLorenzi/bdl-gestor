import { Models } from "node-appwrite";

export type Equipe = Models.Document & {
  nome: string;
  funcao: string;
  telefone: string;
  email: string;
  instrumento: string;
  cache_medio: string;
  chave_pix: string;
  anotacoes: string;
};
