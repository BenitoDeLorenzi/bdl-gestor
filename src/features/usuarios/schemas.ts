import { unmask } from "remask";
import { z } from "zod";

export const createUsuariosSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório"),
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email({ message: "Email inválido." }),
  phone: z
    .string()
    .transform((val) => unmask(val))
    .optional(),
});
