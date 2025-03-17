import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetContratanteProps {
  contratanteId: string;
}

export const useGetContratante = ({
  contratanteId,
}: UseGetContratanteProps) => {
  return useQuery({
    queryKey: ["contratante", contratanteId],
    queryFn: async () => {
      const response = await client.api.contratantes[":contratanteId"].$get({
        param: { contratanteId },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar o contratante.");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
