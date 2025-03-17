import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CircleCheck, ExternalLinkIcon, PencilIcon, Trash } from "lucide-react";
import React from "react";
import { useDeleteShows } from "../api/use-delete-show ";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useEditShowModal } from "../hooks/use-edit-show-modal";
import { useFinalizarShowModal } from "../hooks/use-finalizar-show-modal";
import { ShowStatus } from "../types";

interface ShowsActionsProps {
  id: string;
  children: React.ReactNode;
  status: ShowStatus;
}

export const ShowsActions = ({ id, children, status }: ShowsActionsProps) => {
  const router = useRouter();

  const { open: openEdit } = useEditShowModal();
  const { open: openFinalizar } = useFinalizarShowModal();

  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja excluir esse show?",
    "Essa ação não pode ser desfeita.",
    "destructive"
  );

  const { mutate, isPending } = useDeleteShows();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate({ param: { showId: id } });
  };

  const onOpenShow = () => {
    router.push(`/shows/${id}`);
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenShow}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Detalhes do Show
          </DropdownMenuItem>

          {status !== "FINALIZADO" && (
            <>
              <DropdownMenuItem
                onClick={() => openEdit(id)}
                className="font-medium p-[10px]"
              >
                <PencilIcon className="size-4 mr-2 stroke-2" />
                Editar Show
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openFinalizar(id)}
                className="font-medium p-[10px] text-emerald-700 focus:text-emerald-700"
              >
                <CircleCheck className="size-4 mr-2 stroke-2" />
                Finalizar Show
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                disabled={isPending}
                className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
              >
                <Trash className="size-4 mr-2 stroke-2" />
                Excluir Show
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
