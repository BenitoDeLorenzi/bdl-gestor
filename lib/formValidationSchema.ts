import { Label } from "@radix-ui/react-label";
import { z } from "zod";

export const musicoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().nonempty("O nome é obrigatório."),
  funcao: z.string().nonempty("A função é obrigatória."),
  instrumento: z.string().nonempty("O instrumento é obrigatório."),
  telefone: z.string().nonempty("O telefone é obrigatório."),
  cache_medio: z
    .string()
    .nonempty("Cachê médio é obrigatório")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Cachê médio deve ser um número válido e maior que 0",
    }),
  pix: z.string().optional(),
  img: z.any().optional(),
});

export type MusicoSchema = z.infer<typeof musicoSchema>;

export const contratanteSchema = z.object({
  id: z.string().optional(),
  nome: z.string().nonempty("O nome é obrigatório."),
  contato: z.string().nonempty("O nome de contato é obrigatório."),
  cidade: z.string().nonempty("A cidade é obrigatória."),
  estado: z.string().nonempty("O estado é obrigatório."),
  endereco: z.string().optional(),
  telefone: z.string().nonempty("O telefone é obrigatório."),
  email: z
    .string()
    .email({ message: "Endereço de email inválido." })
    .optional()
    .or(z.literal("")),
  tipo: z.string().nonempty("O tipo é obrigatório."),
});

export type ContratanteSchema = z.infer<typeof contratanteSchema>;

export const showSchema = z.object({
  id: z.string().optional(),
  contratante: contratanteSchema
    .nullable() // Permite que o valor seja `null`
    .refine((val) => val !== null, {
      message: "O contratante é obrigatório.",
    }),
  local: z.string().nonempty("O local do show é obrigatório."),
  valor: z
    .string()
    .nonempty("O valor obrigatório")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), {
      message: "Valor deve ser um número válido.",
    }),
  musicos: z
    .array(
      z.object({
        id: z.string(),
        nome: z.string(),
        funcao: z.string(),
        instrumento: z.string(),
        telefone: z.string(),
        cache_medio: z.number(),
        pix: z.string(),
        img: z.any().optional(),
      })
    )
    .min(1, "Selecione ao menos 1 músico"),
  data_show: z.string().nonempty("A data do show é obrigatória."),
  horario_show: z.string().nonempty("O horário do show é obrigatório."),
  tipo_projeto: z.string().nonempty("O tipo de projeto é obrigatório."),
  descricao: z.string().optional(),
  finalizado: z.boolean(),
});

export type ShowSchema = z.infer<typeof showSchema>;

export const faturamentoSchema = z.object({
  id: z.string().optional(),
  show_id: z.string(),
  contratante_id: z.string(),
  contratante_nome: z.string(),
  data_show: z.string().nonempty("A data do show é obrigatória."),
  valor: z.number(),
  despesa_musicos: z.array(
    z.object({ id: z.string(), nome: z.string(), valor: z.number() })
  ),
  despesas: z
    .array(
      z.object({
        descricao: z.string().default(""), // Define um valor padrão como string vazia
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
  valor_final: z.number(),
  valor_despesas: z.number(),
});

export type FaturamentoSchema = z.infer<typeof faturamentoSchema>;
