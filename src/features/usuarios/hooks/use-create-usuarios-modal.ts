import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateUsuariosModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-usuarios",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close, setIsOpen };
};
