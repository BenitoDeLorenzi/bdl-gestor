import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.perfil)["password"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.perfil)["password"]["$post"]
>;

export const useUpdatePerfilPassword = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.perfil["password"]["$post"]({ json });

      return await response.json();
    },
    onSuccess: ({ success }) => {
      if (success) {
        toast.success("Senha atualizada com sucesso!");
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["perfil"] });
      }
    },
  });

  return mutation;
};
