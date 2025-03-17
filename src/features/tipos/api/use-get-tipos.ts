import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { TiposProps } from "../types";

export const useGetTipos = ({ tipo }: TiposProps) => {
  return useQuery({
    queryKey: ["tipos", tipo],
    queryFn: async () => {
      if (!tipo) {
        throw new Error("O tipo é obrigatório.");
      }

      const response = await client.api.tipos.$get({
        query: { tipo },
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
