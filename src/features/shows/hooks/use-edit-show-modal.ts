import { useQueryState, parseAsString } from "nuqs";

export const useEditShowModal = () => {
  const [showId, setShowId] = useQueryState("edit-shows", parseAsString);

  const open = (id: string) => setShowId(id);
  const close = () => setShowId(null);

  return { showId, open, close, setShowId };
};
