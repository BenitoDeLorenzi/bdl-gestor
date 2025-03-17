import { z } from "zod";

export const createTiposSchema = z.object({
  nome: z.string().nonempty("O nome é obrigatório."),
  tipo: z.string(),
});
