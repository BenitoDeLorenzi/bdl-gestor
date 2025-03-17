import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateTiposModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    `create-tipos`,
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close, setIsOpen };
};
