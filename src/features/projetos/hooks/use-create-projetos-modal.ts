import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateProjetosModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "create-projetos",
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close, setIsOpen };
};
