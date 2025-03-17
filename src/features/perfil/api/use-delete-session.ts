import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.perfil)["session"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.perfil)["session"]["$delete"]
>;

export const useDeleteSession = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.perfil["session"]["$delete"]({ json });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao excluir faturamento.");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Sessão excluida com sucesso.", {
        description: "Você será desconectado",
      });
      window.location.reload();
      queryClient.invalidateQueries({ queryKey: ["perfil-sessions"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
