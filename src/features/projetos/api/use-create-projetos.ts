import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.projetos)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.projetos)["$post"]>;

export const useCreateProjetos = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.projetos["$post"]({ json });

      if (!response.ok) {
        console.log(response);
        throw new Error("Erro ao criar projeto.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      if (data.success) {
        toast.success(data.message);
        router.push(`/projetos/${data.$id}`);
        queryClient.invalidateQueries({ queryKey: ["projetos"] });
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
