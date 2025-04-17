import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = { url: string };

export const useConnectGoogleCalendar = () => {
  const router = useRouter();

  return useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.perfil.calendar.url.$get();
      return await response.json();
    },
    onSuccess: ({ url }) => {
      if (url) {
        // Redireciona para o Google OAuth
        window.location.href = url;
      } else {
        toast.success("Conexão já existente.");
        router.push("/perfil");
      }
    },
    onError: () => {
      toast.error("Erro ao conectar com o Google.");
      router.push("/perfil");
    },
  });
};
