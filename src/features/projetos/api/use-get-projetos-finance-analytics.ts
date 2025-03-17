import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

export type ProjetosFinanceAnalyticsResponseType = InferResponseType<
  (typeof client.api.projetos)["finance"]["analytics"][":projetoId"]["$get"],
  200
>;

interface UseProjetosFinanceAnalyticsProps {
  projetoId: string;
}

export const UseProjetosFinanceAnalytics = ({
  projetoId,
}: UseProjetosFinanceAnalyticsProps) => {
  return useQuery({
    queryKey: ["projetos-finance-analytics", projetoId],
    queryFn: async () => {
      const response = await client.api.projetos["finance"]["analytics"][
        ":projetoId"
      ].$get({
        param: { projetoId: projetoId },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar o dados.");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
