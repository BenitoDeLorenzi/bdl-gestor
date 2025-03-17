import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetLocais = () => {
  return useQuery({
    queryKey: ["locais"],
    queryFn: async () => {
      const response = await client.api.locais.$get();

      if (!response.ok) {
        throw new Error("Falha ao buscar locais");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
