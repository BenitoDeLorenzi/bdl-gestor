"use client";

import { useQueryState } from "nuqs";
import { useCreateProjetosFinanceModal } from "../hooks/use-create-projetos-finance-modal";
import { useCreateProjetosCategoriasModal } from "../hooks/use-create-projetos-categorias-modal";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import DottedSeparator from "@/components/dotted-separator";

import { ArrowUpDown, HandCoins, ListTree, Mail, PlusIcon } from "lucide-react";

import { ProjetosFinanceView } from "./projetos-finance-view";
import { ProjetosMessagesView } from "./projetos-messages-view";
import { cn } from "@/lib/utils";
import { ProjetosFinanceAnalytics } from "./projetos-finance-analytics";

interface ProjetosViewSwitcherProps {
  projetoId: string;
}

export const ProjetosViewSwitcher = ({
  projetoId,
}: ProjetosViewSwitcherProps) => {
  const { open: openMovimento } = useCreateProjetosFinanceModal();
  const { open: openCategorias } = useCreateProjetosCategoriasModal();

  const [view, setView] = useQueryState("projeto-view", {
    defaultValue: "finance",
  });

  return (
    <Tabs
      className="flex-1 w-full border rounded-md"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="w-full lg:w-auto">
                  <PlusIcon className="size-4 mr-2" />
                  Novo
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => openMovimento(projetoId)}>
                  <ArrowUpDown />
                  Movimento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openCategorias(projetoId)}>
                  <ListTree />
                  Categorias
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <DottedSeparator className="py-2" />
        <TabsContent
          value="finance"
          className={cn(
            view === "finance" ? "flex flex-col h-full" : "",
            "mt-0"
          )}
        >
          <ProjetosFinanceAnalytics projetoId={projetoId} />
          <ProjetosFinanceView projetoId={projetoId} />
        </TabsContent>
        <TabsContent
          value="message"
          className={cn(
            view === "message" ? "flex flex-col h-full" : "",
            "mt-0"
          )}
        >
          <ProjetosMessagesView projetoId={projetoId} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
