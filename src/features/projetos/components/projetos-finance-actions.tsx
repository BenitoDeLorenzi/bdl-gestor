import React from "react";
import { PencilIcon, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteProjetosFinance } from "../api/use-delete-projetos-finance";
import { useEditProjetoFinanceModal } from "../hooks/use-edit-projeto-finance-modal";

interface ProjetosFinanceProps {
  id: string;
  children: React.ReactNode;
}

export const ProjetosFinanceActions = ({
  id,
  children,
}: ProjetosFinanceProps) => {
  const { open } = useEditProjetoFinanceModal();
  const { mutate, isPending } = useDeleteProjetosFinance();

  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja excluir esse movimento?",
    "Essa ação não pode ser desfeita.",
    "destructive"
  );

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ param: { financeId: id } });
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Editar movimento
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <Trash className="size-4 mr-2 stroke-2" />
            Excluir movimento
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
