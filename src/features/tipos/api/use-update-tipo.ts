import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tipos)[":tipoId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tipos)[":tipoId"]["$patch"]
>;

export const useUpdateTipo = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tipos[":tipoId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao atualizar tipo.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Tipo atualizado com sucesso!");

      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["tipos"] });
      queryClient.invalidateQueries({ queryKey: ["tipo", data.$id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
