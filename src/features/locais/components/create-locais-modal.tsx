"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { useCreateLocaisModal } from "../hooks/use-create-locais-modal";
import { CreateLocaisFormWrapper } from "./create-locais-form-wrapper";

export const CreateLocaisModal = () => {
  const { isOpen, setIsOpen, close } = useCreateLocaisModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateLocaisFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
