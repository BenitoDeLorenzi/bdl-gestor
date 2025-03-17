import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tipos)[":tipoId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tipos)[":tipoId"]["$delete"]
>;

export const useDeleteTipos = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tipos[":tipoId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao excluir tipo.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      if (data.success) {
        toast.success(data.message);
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["tipos"] });
        queryClient.invalidateQueries({ queryKey: ["tipos", data.$id] });
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
