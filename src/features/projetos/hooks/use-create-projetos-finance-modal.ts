import { useQueryState, parseAsString } from "nuqs";

export const useCreateProjetosFinanceModal = () => {
  const [projetoId, setProjetoId] = useQueryState(
    "create-projeto-finance",
    parseAsString
  );

  const open = (id: string) => setProjetoId(id);
  const close = () => setProjetoId(null);

  return { projetoId, open, close, setProjetoId };
};
