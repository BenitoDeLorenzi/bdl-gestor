import { useQueryState, parseAsString } from "nuqs";

export const useEditProjetoFinanceModal = () => {
  const [financeId, setFinanceId] = useQueryState(
    "edit-projeto-finance",
    parseAsString
  );

  const open = (id: string) => setFinanceId(id);
  const close = () => setFinanceId(null);

  return { financeId, open, close, setFinanceId };
};
