import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetProjetoProps {
  projetoId: string;
}

export const useGetProjeto = ({ projetoId }: UseGetProjetoProps) => {
  return useQuery({
    queryKey: ["projeto", projetoId],
    queryFn: async () => {
      const response = await client.api.projetos[":projetoId"].$get({
        param: { projetoId },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar o projeto.");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
