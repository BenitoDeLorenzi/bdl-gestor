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
import { useDeleteContratantes } from "../api/use-delete-contratante";
import { useEditContratanteModal } from "../hooks/use-edit-contratante-modal";

interface ContratantesActionsProps {
  id: string;
  children: React.ReactNode;
}

export const ContratantesActions = ({
  id,
  children,
}: ContratantesActionsProps) => {
  const { open } = useEditContratanteModal();
  const { mutate, isPending } = useDeleteContratantes();

  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja excluir esse contratante?",
    "Essa ação não pode ser desfeita.",
    "destructive"
  );

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ param: { contratanteId: id } });
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
            Editar Contratante
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <Trash className="size-4 mr-2 stroke-2" />
            Excluir Contratante
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
