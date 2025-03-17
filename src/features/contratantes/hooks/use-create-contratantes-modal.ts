import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateContratantesModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-contratantes",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close, setIsOpen };
};
