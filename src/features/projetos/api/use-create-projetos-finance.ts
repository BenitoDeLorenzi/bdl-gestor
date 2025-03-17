import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projetos)["finance"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.projetos)["finance"]["$post"]
>;

export const useCreateProjetosFinance = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.projetos["finance"]["$post"]({ json });

      if (!response.ok) {
        console.log(response);
        throw new Error("Erro ao criar movimento de finança.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Movimento criado com sucesso");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["create-projeto-finance"] });
      queryClient.invalidateQueries({ queryKey: ["projetos-finance"] });
      queryClient.invalidateQueries({
        queryKey: ["projetos-finance-analytics"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
