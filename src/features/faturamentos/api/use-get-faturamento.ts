import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetFaturamentosProps {
  page: number;
  totalItems: number;
  ano?: string | null;
  local?: string | null;
  contratante?: string | null;
}

export const useGetFaturamentos = ({
  page,
  totalItems,
  ano,
  contratante,
  local,
}: UseGetFaturamentosProps) => {
  return useQuery({
    queryKey: ["faturamentos", page, totalItems, ano, contratante, local],
    queryFn: async () => {
      const response = await client.api.faturamentos.$get({
        query: {
          page: page.toString(),
          totalItems: totalItems.toString(),
          ano: ano ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar faturamentos");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
