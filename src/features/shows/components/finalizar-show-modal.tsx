"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { FinalizarShowFormWrapper } from "./finalizar-show-form-wrapper";
import { useFinalizarShowModal } from "../hooks/use-finalizar-show-modal";

export const FinalizarShowModal = () => {
  const { showId, close } = useFinalizarShowModal();

  return (
    <ResponsiveModal open={!!showId} onOpenChange={close}>
      {showId && <FinalizarShowFormWrapper onCancel={close} id={showId} />}
    </ResponsiveModal>
  );
};
