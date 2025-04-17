import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface useGetTiposProps {
  page: number;
  totalItems: number;
  tipo: "locais" | "funcoes" | "instrumentos" | "projetos";
  search?: string;
}

export const useGetTipos = ({
  page,
  totalItems,
  tipo,
  search,
}: useGetTiposProps) => {
  return useQuery({
    queryKey: ["tipos", tipo, page, totalItems, search],
    queryFn: async () => {
      if (!tipo) {
        throw new Error("O tipo é obrigatório.");
      }

      const response = await client.api.tipos.$get({
        query: { tipo, page, totalItems, search },
      });

      if (!response.ok) {
        console.error(
          "Erro ao buscar tipos:",
          response.status,
          response.statusText
        );
        throw new Error("Falha ao buscar tipos.");
      }

      const { data } = await response.json();
      return data ?? [];
    },
    enabled: !!tipo,
  });
};
