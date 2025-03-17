import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateShowModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-shows",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close, setIsOpen };
};
