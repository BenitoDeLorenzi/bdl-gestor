import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetProjetoFinanceProps {
  projetoId: string;
}

export const useGetProjetosFinance = ({
  projetoId,
}: UseGetProjetoFinanceProps) => {
  return useQuery({
    queryKey: ["projetos-finance", projetoId],
    queryFn: async () => {
      const response = await client.api.projetos["finance"][":projetoId"].$get({
        param: { projetoId: projetoId },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar os projetos");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
