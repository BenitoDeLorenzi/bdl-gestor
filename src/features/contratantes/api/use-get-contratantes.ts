import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetContratantesProps {
  page: number;
  totalItems: number;
  search?: string;
}

export const useGetContratantes = ({
  page,
  totalItems,
  search,
}: UseGetContratantesProps) => {
  return useQuery({
    queryKey: ["contratantes", page, totalItems, search],
    queryFn: async () => {
      const response = await client.api.contratantes.$get({
        query: {
          page: page.toString(),
          totalItems: totalItems.toString(),
          search: search,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar os contratantes");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
