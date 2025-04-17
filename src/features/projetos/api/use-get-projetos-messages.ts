import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetProjetoMessagesProps {
  projetoNome: string;
  page: number;
  totalItems: number;
}

export const useGetProjetosMessages = ({
  projetoNome,
  page,
  totalItems,
}: UseGetProjetoMessagesProps) => {
  return useQuery({
    queryKey: ["projetos-messages", projetoNome, page, totalItems],
    queryFn: async () => {
      const response = await client.api.projetos["messages"][
        ":projetoNome"
      ].$get({
        param: { projetoNome: projetoNome },
        query: {
          page: page.toString(),
          totalItems: totalItems.toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar os projetos");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
