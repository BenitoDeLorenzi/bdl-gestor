import { useQueryState, parseAsString } from "nuqs";

export const useEditEquipeModal = () => {
  const [equipeId, setEquipeId] = useQueryState("edit-equipe", parseAsString);

  const open = (id: string) => setEquipeId(id);
  const close = () => setEquipeId(null);

  return { equipeId, open, close, setEquipeId };
};
