import { unmask } from "remask";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email({ message: "Email inválido." }),
  password: z.string().nonempty("A senha é obrigatória."),
});

export const registerSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email({ message: "Email inválido." }),
  password: z.string().nonempty("A senha é obrigatória."),
});
