import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetPerfilSessoesProps {
  userId: string;
}

export const useGetPerfilSessoes = ({ userId }: UseGetPerfilSessoesProps) => {
  return useQuery({
    queryKey: ["perfil-sessions", userId],
    queryFn: async () => {
      const response = await client.api.perfil["sessions"][":userId"].$get({
        param: { userId: userId },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar os contratantes");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
