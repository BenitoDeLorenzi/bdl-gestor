import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetTipoProps {
  tipoId: string;
}

export const useGetTipo = ({ tipoId }: UseGetTipoProps) => {
  return useQuery({
    queryKey: ["tipo", tipoId],
    queryFn: async () => {
      if (!tipoId) {
        throw new Error("tipoId é obrigatório.");
      }

      const response = await client.api.tipos[":tipoId"].$get({
        param: { tipoId: tipoId },
      });

      if (!response.ok) {
        console.error(
          "Erro ao buscar o tipo:",
          response.status,
          response.statusText
        );
        throw new Error("Falha ao buscar o tipo.");
      }

      const { data } = await response.json();
      return data;
    },
    enabled: !!tipoId, // Só executa a query se o tipoId existir
  });
};
