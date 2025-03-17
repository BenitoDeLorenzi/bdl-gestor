import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.faturamentos)[":faturamentoId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.faturamentos)[":faturamentoId"]["$delete"]
>;

export const useDeleteFaturamentos = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.faturamentos[":faturamentoId"][
        "$delete"
      ]({ param, json: { showId: json.showId } });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao excluir faturamento.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Faturamento exluido com sucesso!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["faturamentos"] });
      queryClient.invalidateQueries({ queryKey: ["faturamentos", data.$id] });
      queryClient.invalidateQueries({ queryKey: ["shows"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
