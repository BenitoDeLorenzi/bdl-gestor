import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetEquipe = () => {
  return useQuery({
    queryKey: ["equipe"],
    queryFn: async () => {
      const response = await client.api.equipe.$get();

      if (!response.ok) {
        throw new Error("Falha ao buscar equipe");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
