"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateContratantesModal } from "../hooks/use-create-contratantes-modal";
import { CreateContratantesForm } from "./create-contratantes-form";

export const CreateContratantesModal = () => {
  const { isOpen, setIsOpen, close } = useCreateContratantesModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateContratantesForm onCancel={close} />
    </ResponsiveModal>
  );
};
