import { useQueryState, parseAsString } from "nuqs";

export const useFinalizarShowModal = () => {
  const [showId, setShowId] = useQueryState("finalizar-shows", parseAsString);

  const open = (id: string) => setShowId(id);
  const close = () => setShowId(null);

  return { showId, open, close, setShowId };
};
