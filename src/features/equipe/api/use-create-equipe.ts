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
        const data = (await response.json()) as { error?: string };
        throw new Error(data?.error ?? "Erro ao criar mebro da equipe.");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Membro da equipe criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["equipe"] });
      router.refresh();
    },
  });

  return mutation;
};
