import { z } from "zod";

export const createProjetosSchema = z.object({
  nome: z.string().nonempty("O nome é obrigatório"),
});

export const createProjetosFinanceSchema = z.object({
  projeto_id: z.string(),
  tipo: z.string().nonempty("O tipo é obrigatório"),
  status: z.string().nonempty("O status  é obrigatório"),
  valor: z.number().min(1, "O valor é obrigatório."),
  data: z
    .union([z.date(), z.string().transform((str) => new Date(str))])
    .refine((date) => !isNaN(date.getTime()), { message: "Data inválida" }),
  forma_pagamento: z.string().nonempty("A forma de pagamento é obrigatória"),
  descricao: z.string().nonempty("A descrição é obrigatória"),
  obecervacoes: z.string().optional(),
});
