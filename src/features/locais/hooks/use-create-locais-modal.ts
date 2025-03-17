import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateLocaisModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-locais",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close, setIsOpen };
};
