import { z } from "zod";
import { unmask } from "remask"; // Substitua pela biblioteca real que você está usando

export const createEquipeSchema = z.object({
  nome: z.string().nonempty("O nome é obrigatório."),
  funcao: z.string().nonempty("A função é obrigatória."),
  telefone: z
    .string()
    .nonempty("O telefone é obrigatório.")
    .transform((val) => unmask(val)),
  email: z
    .string()
    .optional()
    .refine((val) => !val || /\S+@\S+\.\S+/.test(val), {
      message: "Email inválido",
    }),
  instrumento: z.string().optional(),
  cache_medio: z.string().optional(),
  chave_pix: z.string().optional(),
  anotacoes: z.string().optional(),
});
