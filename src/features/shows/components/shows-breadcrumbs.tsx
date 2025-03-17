import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ChevronRight, TrashIcon } from "lucide-react";

import { useConfirm } from "@/hooks/use-confirm";

import { useDeleteShows } from "../api/use-delete-show ";
import { Shows } from "../types";

interface ShowsBreadCrumbsProps {
  show: Shows;
}

export const ShowsBreadCrumbs = ({ show }: ShowsBreadCrumbsProps) => {
  const router = useRouter();
  const { mutate, isPending } = useDeleteShows();
  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja excluir esse show?",
    "Essa ação não pode ser desfeita.",
    "destructive"
  );

  const handleDeleteShow = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { param: { showId: show.$id } },
      {
        onSuccess: () => {
          router.push("/shows");
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <Link href={`/shows/`}>Shows</Link>
      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
      <p className="font-semibold">
        {typeof show.local === "string" ? show.local : show.local.nome}
      </p>
      {show.status !== "FINALIZADO" && (
        <Button
          className="ml-auto"
          variant="destructive"
          size="sm"
          onClick={handleDeleteShow}
          disabled={isPending}
        >
          <TrashIcon className="size-4 lg:mr-2" />
          <span className="hidden lg:block">Excluir show</span>
        </Button>
      )}
    </div>
  );
};
