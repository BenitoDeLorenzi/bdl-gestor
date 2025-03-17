import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.shows)["faturamento"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.shows)["faturamento"]["$post"]
>;

export const useCreateFaturamento = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.shows["faturamento"]["$post"]({ json });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao criar faturamento.");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Faturamento criado com sucesso!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      queryClient.invalidateQueries({ queryKey: ["shows-faturamento"] });
      queryClient.invalidateQueries({ queryKey: ["faturamentos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-analytics"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
