import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetProjetoFinanceProps {
  projetoId: string;
  page: number;
  totalItems: number;
  status?: string;
  forma_pagamento?: string;
  categoria?: string;
  tipo?: string;
}

export const useGetProjetosFinance = ({
  projetoId,
  page,
  totalItems,
  status,
  categoria,
  forma_pagamento,
  tipo,
}: UseGetProjetoFinanceProps) => {
  return useQuery({
    queryKey: [
      "projetos-finance",
      projetoId,
      page,
      totalItems,
      categoria,
      status,
      forma_pagamento,
      tipo,
    ],
    queryFn: async () => {
      const response = await client.api.projetos["finance"][":projetoId"].$get({
        param: { projetoId: projetoId },
        query: {
          page: page.toString(),
          totalItems: totalItems.toString(),
          categoria,
          forma_pagamento,
          status,
          tipo,
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
