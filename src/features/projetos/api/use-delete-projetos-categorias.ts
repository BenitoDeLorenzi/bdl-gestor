import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projetos)["categorias"][":categoriaId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.projetos)["categorias"][":categoriaId"]["$delete"]
>;

export const useDeleteProjetosCategorias = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.projetos["categorias"][":categoriaId"][
        "$delete"
      ]({
        param,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao excluir movimento.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Categoria excluida com sucesso.");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["projeto-categorias"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
