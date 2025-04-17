import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.tipos)["$post"], 200>;
type RequestType = InferRequestType<(typeof client.api.tipos)["$post"]>;

export const useCreateTipos = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tipos["$post"]({ json });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data?.error ?? "Erro ao criar tipo.");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Tipo criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["tipos"] });
      router.refresh();
    },
  });

  return mutation;
};
