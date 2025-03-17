"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { useCreateProjetosModal } from "../hooks/use-create-projetos-modal";
import { CreateProjetosForm } from "./create-projetos-form";

export const CreateProjetosModal = () => {
  const { isOpen, setIsOpen, close } = useCreateProjetosModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjetosForm onCancel={close} />
    </ResponsiveModal>
  );
};
