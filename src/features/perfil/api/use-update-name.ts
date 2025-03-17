import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.perfil)["name"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.perfil)["name"]["$post"]
>;

export const useUpdatePerfilName = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.perfil["name"]["$post"]({
        json,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao atualizar nome do perfil.");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");

      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["perfil"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
