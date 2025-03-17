import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.usuarios)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.usuarios)["$post"]>;

export const useCreateUsuarios = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.usuarios["$post"]({ json });
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          "Usuário cadastrado! Verificar o email do usuário cadastrado."
        );
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["usuarios"] });
        queryClient.invalidateQueries({ queryKey: ["create-usuarios"] });
      }
    },
  });

  return mutation;
};
