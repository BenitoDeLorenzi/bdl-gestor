import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projetos)["finance"][":financeId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projetos)["finance"][":financeId"]["$delete"]
>;

export const useDeleteProjetosFinance = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projetos["finance"][":financeId"][
        "$delete"
      ]({
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao excluir movimento.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Movimento excluido com sucesso.");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["projetos-finance"] });
      queryClient.invalidateQueries({
        queryKey: ["projetos-finance", data.$id],
      });
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
