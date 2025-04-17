import { useQueryState, parseAsString } from "nuqs";

export const useCreateProjetosCategoriasModal = () => {
  const [projetoId, setProjetoId] = useQueryState(
    "create-projeto-categorias",
    parseAsString
  );

  const open = (id: string) => setProjetoId(id);
  const close = () => setProjetoId(null);

  return { projetoId, open, close, setProjetoId };
};
