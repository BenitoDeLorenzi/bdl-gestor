import { useQueryState, parseAsString } from "nuqs";

export const useEditTipoModal = () => {
  const [tipoId, setTipoId] = useQueryState("edit-tipo", parseAsString);

  const open = (id: string) => setTipoId(id);
  const close = () => setTipoId(null);

  return { tipoId, open, close, setTipoId };
};
