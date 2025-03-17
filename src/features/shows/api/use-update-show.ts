import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.shows)[":showId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.shows)[":showId"]["$patch"]
>;

export const useUpdateShow = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.shows[":showId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao atualizar show.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Show atualizado com sucesso!");

      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      queryClient.invalidateQueries({ queryKey: ["show", data.$id] });
      queryClient.invalidateQueries({ queryKey: ["shows-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-analytics"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
