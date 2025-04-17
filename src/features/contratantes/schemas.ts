import { unmask } from "remask";
import { z } from "zod";

export const createContratantesSchema = z.object({
  nome: z.string().nonempty("O nome é obrigatório."),
  telefone: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
      message: "Email inválido",
    }),
  anotacoes: z.string().optional(),
});
