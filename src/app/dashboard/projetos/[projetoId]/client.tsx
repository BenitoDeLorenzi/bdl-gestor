"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetProjeto } from "@/features/projetos/api/use-get-projeto";
import { ProjetosViewSwitcher } from "@/features/projetos/components/projetos-view-switcher";
import { useProjetoId } from "@/features/projetos/hooks/use-projeto-id";

export const ProjetoIdClient = () => {
  const projetoId = useProjetoId();
  const { data, isLoading } = useGetProjeto({ projetoId: projetoId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!data) {
    return <PageError message="Projeto não encontrado." />;
  }

  return <ProjetosViewSwitcher projetoId={projetoId} />;
};
