import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetProjetos = () => {
  return useQuery({
    queryKey: ["projetos"],
    queryFn: async () => {
      const response = await client.api.projetos.$get();

      if (!response.ok) {
        throw new Error("Falha ao buscar os projetos");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
