import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useDisconnectGoogleCalendar = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await client.api.perfil.calendar.disconnect.$post();
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Google Calendar desconectado!");
      router.refresh();
    },
    onError: () => {
      toast.error("Erro ao desconectar do Google Calendar.");
    },
  });
};
