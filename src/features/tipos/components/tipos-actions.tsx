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
import { useDeleteTipos } from "../api/use-delete-tipos";
import { useEditTipoModal } from "../hooks/use-edit-tipo-modal";

interface LocaisActionsProps {
  id: string;
  children: React.ReactNode;
}

export const TiposActions = ({ id, children }: LocaisActionsProps) => {
  const { open } = useEditTipoModal();
  const { mutate, isPending } = useDeleteTipos();

  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja excluir esse tipo?",
    "Essa ação não pode ser desfeita.",
    "destructive"
  );

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ param: { tipoId: id } });
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
            Editar tipo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <Trash className="size-4 mr-2 stroke-2" />
            Excluir tipo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
