import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.locais)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.locais)["$post"]>;

export const useCreateLocais = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.locais["$post"]({ json });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data?.error ?? "Erro ao criar local.");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Local criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["locais"] });
      router.refresh();
    },
  });

  return mutation;
};
