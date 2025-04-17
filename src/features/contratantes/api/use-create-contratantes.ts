import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.contratantes)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.contratantes)["$post"]>;

export const useCreateContratantes = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.contratantes["$post"]({ json });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data?.error ?? "Erro ao criar contratante.");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Contratante criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["contratantes"] });
      router.refresh();
    },
  });

  return mutation;
};
