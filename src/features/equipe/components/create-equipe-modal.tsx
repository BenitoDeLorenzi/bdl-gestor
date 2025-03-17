"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { CreateEquipeForm } from "./create-equipe-form";
import { useCreateEquipeModal } from "../hooks/use-create-equipe-modal";
import { CreateEquipeFormWrapper } from "./create-equipe-form-wrapper";

export const CreateEquipeModal = () => {
  const { isOpen, setIsOpen, close } = useCreateEquipeModal();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateEquipeFormWrapper onCancel={close} />
    </ResponsiveModal>
  );
};
