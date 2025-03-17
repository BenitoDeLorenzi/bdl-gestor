import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.locais)[":localId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.locais)[":localId"]["$patch"]
>;

export const useUpdateLocal = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.locais[":localId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao atualizar local.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Local atualizado com sucesso!");

      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["locais"] });
      queryClient.invalidateQueries({ queryKey: ["local", data.$id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
