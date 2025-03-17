"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useEditProjetoFinanceModal } from "../hooks/use-edit-projeto-finance-modal";
import { EditProjetoFinanceFormWrapper } from "./edit-projeto-finance-form-wrapper";

export const EditProjetoFinanceModal = () => {
  const { financeId, close } = useEditProjetoFinanceModal();

  return (
    <ResponsiveModal open={!!financeId} onOpenChange={close}>
      {financeId && (
        <EditProjetoFinanceFormWrapper onCancel={close} id={financeId} />
      )}
    </ResponsiveModal>
  );
};
