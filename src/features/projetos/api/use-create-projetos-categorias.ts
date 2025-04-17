import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.projetos)["categorias"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.projetos)["categorias"]["$post"]
>;

export const useCreateProjetosCategorias = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.projetos["categorias"]["$post"]({
        json,
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Erro ao criar categoria.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Categoria criada com sucesso");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["projeto-categorias"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
