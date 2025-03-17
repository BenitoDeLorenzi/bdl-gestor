import { useQueryState, parseAsString } from "nuqs";

export const useEditLocalModal = () => {
  const [localId, setLocalId] = useQueryState("edit-local", parseAsString);

  const open = (id: string) => setLocalId(id);
  const close = () => setLocalId(null);

  return { localId, open, close, setLocalId };
};
