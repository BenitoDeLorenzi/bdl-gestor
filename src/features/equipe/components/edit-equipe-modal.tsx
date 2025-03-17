"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { useEditEquipeModal } from "../hooks/use-edit-equipe-modal";
import { EditEquipeFormWrapper } from "./edit-equipe-form-wrapper";

export const EditEquipeModal = () => {
  const { equipeId, close } = useEditEquipeModal();

  return (
    <ResponsiveModal open={!!equipeId} onOpenChange={close}>
      {equipeId && <EditEquipeFormWrapper onCancel={close} id={equipeId} />}
    </ResponsiveModal>
  );
};
