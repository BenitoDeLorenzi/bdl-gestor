import { Button } from "@/components/ui/button";

import { useConfirm } from "@/hooks/use-confirm";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteFaturamentos } from "../api/use-delete-faturamento";

interface FaturamentoActionsProps {
  id: string;
  showId: string;
}

export const FaturamentoActions = ({ id, showId }: FaturamentoActionsProps) => {
  const router = useRouter();
  const { mutate, isPending } = useDeleteFaturamentos();

  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja excluir esse faturamento?",
    "Essa ação não pode ser desfeita.",
    "destructive"
  );

  const handleDeleteShow = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { param: { faturamentoId: id }, json: { showId: showId } },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };
  return (
    <>
      <ConfirmDialog />
      <Button variant="ghost" className="size-8 p-0" onClick={handleDeleteShow}>
        {isPending ? (
          <Loader2 className="animate-spin text-muted-foreground" />
        ) : (
          <Trash className="text-amber-700" />
        )}
      </Button>
    </>
  );
};
