import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetLocaisProps {
  page: number;
  totalItems: number;
  tipo?: string;
  search?: string;
}

export const useGetLocais = ({
  page,
  totalItems,
  tipo,
  search,
}: UseGetLocaisProps) => {
  return useQuery({
    queryKey: ["locais", page, totalItems, tipo, search],
    queryFn: async () => {
      const response = await client.api.locais.$get({
        query: {
          page: page.toString(),
          totalItems: totalItems.toString(),
          tipo: tipo,
          search: search,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar locais");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
