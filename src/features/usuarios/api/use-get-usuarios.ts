import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetUsuarios = () => {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const response = await client.api.usuarios.$get();

      if (!response.ok) {
        throw new Error("Falha ao buscar os usuarios");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
