import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetProjetoFinanceProps {
  financeId: string;
}

export const useGetProjetoFinance = ({
  financeId,
}: UseGetProjetoFinanceProps) => {
  return useQuery({
    queryKey: ["projeto-finance", financeId],
    queryFn: async () => {
      const response = await client.api.projetos["finance"]["movimentos"][
        ":financeId"
      ].$get({
        param: { financeId },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar o contratante.");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
