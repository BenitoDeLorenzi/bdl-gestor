import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.equipe)[":equipeId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.equipe)[":equipeId"]["$patch"]
>;

export const useUpdateEquipe = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.equipe[":equipeId"]["$patch"]({
        json,
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao atualizar membro da equipe.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Membro da equipe atualizado com sucesso!");

      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["equipe"] });
      queryClient.invalidateQueries({ queryKey: ["membro", data.$id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
