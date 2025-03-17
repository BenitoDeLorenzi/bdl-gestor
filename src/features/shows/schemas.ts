import { z } from "zod";
import { ShowStatus } from "./types";

export const createShowsSchema = z.object({
  status: z.nativeEnum(ShowStatus).default(ShowStatus.CONFIRMADO),
  valor: z.number().min(1, "O valor é obrigatório."),
  contratante: z.string().trim().nonempty("O contratante é obrigatório."),
  local: z.string().trim().nonempty("O local é obrigatório."),
  projeto: z.string().trim().nonempty("O projeto é obrigatório."),
  data: z
    .union([z.date(), z.string().transform((str) => new Date(str))])
    .refine((date) => !isNaN(date.getTime()), { message: "Data inválida" }),
  horario: z
    .union([z.date(), z.string().transform((str) => new Date(str))])
    .refine((date) => !isNaN(date.getTime()), { message: "Horário inválido" }),
  anotacoes: z.string().optional(),
  equipe: z
    .array(z.string())
    .min(1, "Ao menos um membro deve ser selecionado."),
});

export const createFaturamentoSchema = z.object({
  show_id: z.string(),
  data_pagamento: z
    .union([z.date(), z.string().transform((str) => new Date(str))])
    .refine((date) => !isNaN(date.getTime()), { message: "Data inválida" }),
  valor: z.number(),
  valor_recebido: z.number(),
  valor_despesas: z.number(),
  despesa_musicos: z.array(
    z.object({ $id: z.string(), nome: z.string(), valor: z.number() })
  ),
  despesas: z
    .array(
      z.object({
        descricao: z.string().default(""),
        valor: z.number().min(0, "O valor deve ser positivo."),
      })
    )
    .refine(
      (despesas) =>
        despesas.every((despesa) =>
          despesa.valor > 0 ? (despesa.descricao || "").trim().length > 0 : true
        ),
      {
        message: "A descrição é obrigatória quando o valor for maior que zero.",
        path: ["despesas"],
      }
    ),
});
