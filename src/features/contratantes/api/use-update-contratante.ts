import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.contratantes)[":contratanteId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.contratantes)[":contratanteId"]["$patch"]
>;

export const useUpdateContratante = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.contratantes[":contratanteId"][
        "$patch"
      ]({
        json,
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao atualizar contratante.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Contratante atualizado com sucesso!");

      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["contratantes"] });
      queryClient.invalidateQueries({ queryKey: ["contratante", data.$id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
