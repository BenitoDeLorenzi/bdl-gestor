"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { useGetProjeto } from "../api/use-get-projeto";
import DottedSeparator from "@/components/dotted-separator";
import { HandCoins, Loader, Mail, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateProjetosFinanceModal } from "../hooks/use-create-projetos-finance-modal";
import { useGetProjetosFinance } from "../api/use-get-projetos-finance";
import { ProjetosFinanceDataTable } from "./projetos-finance-data-table";
import { projetosFinanceColumns } from "./projetos-finance-columns";
import { ProjetosFinanceAnalytics } from "./projetos-finance-analytics";

interface ProjetosViewSwitcherProps {
  projetoId: string;
}

export const ProjetosViewSwitcher = ({
  projetoId,
}: ProjetosViewSwitcherProps) => {
  const { open } = useCreateProjetosFinanceModal();

  const { data: projeto, isLoading: isLoadingProjeto } = useGetProjeto({
    projetoId: projetoId,
  });

  const { data: projetoFinance, isLoading: isLoadingProjetoFinance } =
    useGetProjetosFinance({ projetoId: projetoId });

  const [view, setView] = useQueryState("projeto-view", {
    defaultValue: "finance",
  });

  const isLoading = isLoadingProjeto || isLoadingProjetoFinance;

  return (
    <Tabs
      className="flex-1 w-full border rounded-md"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <h1 className="text-xl font-semibold">{projeto?.nome}</h1>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="finance">
              <div className="flex gap-2 items-center">
                <HandCoins className="size-5" />
                <span>Finanças</span>
              </div>
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="message">
              <div className="flex gap-2 items-center">
                <Mail className="size-5" />
                <span>Mensagens</span>
              </div>
            </TabsTrigger>
          </TabsList>
          {view === "finance" && (
            <Button
              size="sm"
              className="w-full lg:w-auto"
              onClick={() => open(projetoId)}
            >
              <PlusIcon className="size-4 mr-2" />
              Novo
            </Button>
          )}
        </div>
        <DottedSeparator className="mt-4" />
        {isLoading ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="finance" className="mt-0">
              <ProjetosFinanceAnalytics projetoId={projetoId} />
              <ProjetosFinanceDataTable
                columns={projetosFinanceColumns}
                data={projetoFinance?.documents || []}
              />
            </TabsContent>
            <TabsContent value="message" className="mt-0">
              Mensagens
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
