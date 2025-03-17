"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useEditTipoModal } from "../hooks/use-edit-tipo-modal";
import { EditTipoFormWrapper } from "./edit-tipo-form-wrapper";

export const EditTipoModal = () => {
  const { tipoId, close } = useEditTipoModal();

  return (
    <ResponsiveModal open={!!tipoId} onOpenChange={close}>
      {tipoId && <EditTipoFormWrapper onCancel={close} id={tipoId} />}
    </ResponsiveModal>
  );
};
