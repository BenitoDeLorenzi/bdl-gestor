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
import { useDeleteEquipe } from "../api/use-delete-equipe";
import { useEditEquipeModal } from "../hooks/use-edit-equipe-modal";

interface EquipeActionsProps {
  id: string;
  children: React.ReactNode;
}

export const EquipeActions = ({ id, children }: EquipeActionsProps) => {
  const { open } = useEditEquipeModal();
  const { mutate, isPending } = useDeleteEquipe();

  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja excluir esse membro da equipe?",
    "Essa ação não pode ser desfeita.",
    "destructive"
  );

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ param: { equipeId: id } });
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
            Editar Membro
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <Trash className="size-4 mr-2 stroke-2" />
            Excluir Membro
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
