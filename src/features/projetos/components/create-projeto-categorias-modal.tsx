"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { useCreateProjetosCategoriasModal } from "../hooks/use-create-projetos-categorias-modal";
import { CreateProjetosCategoriasWrapper } from "./create-projeto-categorias-form-wrapper";

export const CreateProjetoCategoriasModal = () => {
  const { projetoId, close } = useCreateProjetosCategoriasModal();

  return (
    <ResponsiveModal open={!!projetoId} onOpenChange={close}>
      {projetoId && (
        <CreateProjetosCategoriasWrapper
          projetoId={projetoId}
          onCancel={close}
        />
      )}
    </ResponsiveModal>
  );
};
