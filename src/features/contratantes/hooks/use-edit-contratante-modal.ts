import { useQueryState, parseAsString } from "nuqs";

export const useEditContratanteModal = () => {
  const [contratanteId, setContratanteId] = useQueryState(
    "edit-contratante",
    parseAsString
  );

  const open = (id: string) => setContratanteId(id);
  const close = () => setContratanteId(null);

  return { contratanteId, open, close, setContratanteId };
};
