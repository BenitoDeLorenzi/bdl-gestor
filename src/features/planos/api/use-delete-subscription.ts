import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.planos.$delete, 200>;
type RequestType = InferRequestType<typeof client.api.planos.$delete>;

export const useDeleteSubscription = () => {
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.planos.$delete({
        json,
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Erro ao cancelar assinatura.");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Assinatura cancelada com sucesso");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
