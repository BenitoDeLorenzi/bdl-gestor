import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.equipe)[":equipeId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.equipe)[":equipeId"]["$delete"]
>;

export const useDeleteEquipe = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.equipe[":equipeId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao excluir membro.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      if (data.success) {
        toast.success(data.message);
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["equipe"] });
        queryClient.invalidateQueries({ queryKey: ["equipe", data.$id] });
      } else {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
