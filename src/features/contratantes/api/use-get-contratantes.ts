import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetContratantes = () => {
  return useQuery({
    queryKey: ["contratantes"],
    queryFn: async () => {
      const response = await client.api.contratantes.$get();

      if (!response.ok) {
        throw new Error("Falha ao buscar os contratantes");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
