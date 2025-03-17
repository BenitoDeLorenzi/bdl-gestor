import { Button } from "@/components/ui/button";

import { useConfirm } from "@/hooks/use-confirm";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDeleteSession } from "../api/use-delete-session";

interface SessionsActionsProps {
  sessionId: string;
  userId: string;
}

export const SessionsActions = ({
  sessionId,
  userId,
}: SessionsActionsProps) => {
  const router = useRouter();
  const { mutate, isPending } = useDeleteSession();

  const [ConfirmDialog, confirm] = useConfirm(
    "Deseja excluir essa sessão?",
    "Você será desconectado do dispositivo selecionado.",
    "destructive"
  );

  const handleDeleteShow = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(
      { json: { sessionId: sessionId, userId: userId } },
      {
        onSuccess: () => {
          router.push("/");
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
