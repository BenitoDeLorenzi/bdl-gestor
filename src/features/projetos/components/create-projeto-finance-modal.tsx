"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { useCreateProjetosFinanceModal } from "../hooks/use-create-projetos-finance-modal";
import { CreateProjetosFinanceForm } from "./create-projeto-finance-form";

export const CreateProjetoFinanceModal = () => {
  const { projetoId, close } = useCreateProjetosFinanceModal();

  return (
    <ResponsiveModal open={!!projetoId} onOpenChange={close}>
      {projetoId && (
        <CreateProjetosFinanceForm onCancel={close} projetoId={projetoId} />
      )}
    </ResponsiveModal>
  );
};
