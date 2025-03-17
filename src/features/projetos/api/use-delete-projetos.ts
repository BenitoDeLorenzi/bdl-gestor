import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projetos)[":projetoId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projetos)[":projetoId"]["$delete"]
>;

export const useDeleteProjetos = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projetos[":projetoId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao excluir projeto.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      if (data.success) {
        toast.success("Projeto excluido com sucesso.");
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["projetos"] });
        queryClient.invalidateQueries({ queryKey: ["projetos", data.$id] });
      } else {
        toast.error("Projeto não pode ser excluido.", {
          description: "Existem movimentos nesse projeto.",
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
