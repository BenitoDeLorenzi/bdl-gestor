import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.perfil)["phone"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.perfil)["phone"]["$post"]
>;

export const useUpdatePerfilPhone = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.perfil["phone"]["$post"]({ json });

      return await response.json();
    },
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Telefone atualizado com sucesso!");
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["perfil"] });
      }
    },
  });
};
