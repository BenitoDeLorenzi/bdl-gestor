"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useEditLocalModal } from "../hooks/use-edit-local-modal";
import { EditLocalFormWrapper } from "./edit-local-form-wrapper";

export const EditLocalModal = () => {
  const { localId, close } = useEditLocalModal();

  return (
    <ResponsiveModal open={!!localId} onOpenChange={close}>
      {localId && <EditLocalFormWrapper onCancel={close} id={localId} />}
    </ResponsiveModal>
  );
};
