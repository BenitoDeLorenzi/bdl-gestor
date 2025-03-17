import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projetos)["finance"][":financeId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projetos)["finance"][":financeId"]["$patch"]
>;

export const useUpdateProjetosFinance = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.projetos["finance"][":financeId"][
        "$patch"
      ]({
        json,
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao atualizar movimento.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Movimento atualizado com sucesso!");

      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["projetos-finance"] });
      queryClient.invalidateQueries({
        queryKey: ["projetos-finance-analytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projeto-finance", data.$id],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
