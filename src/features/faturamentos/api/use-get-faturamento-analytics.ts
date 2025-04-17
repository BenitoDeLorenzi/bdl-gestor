import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetFaturamentoAnalyticsProps {
  ano?: string | null;
}

export const useGetFaturamentoAnalytics = ({
  ano,
}: UseGetFaturamentoAnalyticsProps) => {
  return useQuery({
    queryKey: ["faturamentos-analytics", ano],
    queryFn: async () => {
      const response = await client.api.faturamentos["analytics"].$get({
        query: {
          ano: ano || undefined,
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
