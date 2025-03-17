"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useEditShowModal } from "../hooks/use-edit-show-modal";
import { EditShowFormWrapper } from "./edit-show-form-wrapper";

export const EditShowModal = () => {
  const { showId, close } = useEditShowModal();

  return (
    <ResponsiveModal open={!!showId} onOpenChange={close}>
      {showId && <EditShowFormWrapper onCancel={close} id={showId} />}
    </ResponsiveModal>
  );
};
