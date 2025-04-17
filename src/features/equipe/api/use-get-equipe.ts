import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetEquipeProps {
  page: number;
  totalItems: number;
  funcao?: string;
  instrumento?: string;
  search?: string;
}

export const useGetEquipe = ({
  page,
  totalItems,
  funcao,
  instrumento,
  search,
}: UseGetEquipeProps) => {
  return useQuery({
    queryKey: ["equipe", page, totalItems, funcao, instrumento, search],
    queryFn: async () => {
      const response = await client.api.equipe.$get({
        query: {
          page: page.toString(),
          totalItems: totalItems.toString(),
          funcao,
          instrumento,
          search,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar equipe");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
