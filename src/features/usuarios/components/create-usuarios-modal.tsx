"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { useCreateUsuariosModal } from "../hooks/use-create-usuarios-modal";
import { CreateUsuariosForm } from "./create-usuarios-form";

export const CreateUsuariosModal = () => {
  const { isOpen, setIsOpen, close } = useCreateUsuariosModal();
  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[430px]"
    >
      <CreateUsuariosForm onCancel={close} />
    </ResponsiveModal>
  );
};
