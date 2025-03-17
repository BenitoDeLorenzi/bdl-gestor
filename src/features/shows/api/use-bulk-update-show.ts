import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.shows)["bulk-update"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.shows)["bulk-update"]["$post"]
>;

export const useBulkUpdateShow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.shows["bulk-update"]["$post"]({
        json,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao atualizar show.");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Show atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      queryClient.invalidateQueries({ queryKey: ["shows-analytics"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
