"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { useCreateProjetosFinanceModal } from "../hooks/use-create-projetos-finance-modal";

import { CreateProjetosFinanceFormWrapper } from "./create-projeto-finance-form-wrapper";

export const CreateProjetoFinanceModal = () => {
  const { projetoId, close } = useCreateProjetosFinanceModal();

  return (
    <ResponsiveModal open={!!projetoId} onOpenChange={close}>
      {projetoId && (
        <CreateProjetosFinanceFormWrapper
          onCancel={close}
          projetoId={projetoId}
        />
      )}
    </ResponsiveModal>
  );
};
