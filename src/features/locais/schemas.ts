import { z } from "zod";

export const createLocaisSchema = z.object({
  nome: z.string().nonempty("O nome é obrigatório"),
  tipo: z.string().nonempty("O tipo é obrigatório"),
  cep: z.string().nonempty("O cep é obrigatório"),
  uf: z.string().nonempty("O estado é obrigatório"),
  cidade: z.string().nonempty("A cidade é obrigatória"),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  anotacoes: z.string().optional(),
});
