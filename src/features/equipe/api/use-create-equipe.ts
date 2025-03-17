import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.equipe)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.equipe)["$post"]>;

export const useCreateEquipe = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.equipe["$post"]({ json });

      if (!response.ok) {
        console.log(response);
        throw new Error("Erro ao criar membro da equipe.");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Membro da equipe criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["equipe"] });
      router.push("/equipe");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
