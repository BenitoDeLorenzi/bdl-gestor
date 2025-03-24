import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetProjetoMessagesProps {
  projetoNome: string;
}

export const useGetProjetosMessages = ({
  projetoNome,
}: UseGetProjetoMessagesProps) => {
  return useQuery({
    queryKey: ["projetos-messages", projetoNome],
    queryFn: async () => {
      const response = await client.api.projetos["messages"][
        ":projetoNome"
      ].$get({
        param: { projetoNome: projetoNome },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar os projetos");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
