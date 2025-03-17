import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetFaturamentos = () => {
  return useQuery({
    queryKey: ["faturamentos"],
    queryFn: async () => {
      const response = await client.api.faturamentos.$get();

      if (!response.ok) {
        throw new Error("Falha ao buscar faturamentos");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
