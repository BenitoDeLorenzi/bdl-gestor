"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useEditContratanteModal } from "../hooks/use-edit-contratante-modal";
import { EditContratanteFormWrapper } from "./edit-contratante-form-wrapper";

export const EditContratanteModal = () => {
  const { contratanteId, close } = useEditContratanteModal();

  return (
    <ResponsiveModal open={!!contratanteId} onOpenChange={close}>
      {contratanteId && (
        <EditContratanteFormWrapper onCancel={close} id={contratanteId} />
      )}
    </ResponsiveModal>
  );
};
