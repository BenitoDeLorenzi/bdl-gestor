import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetMembroProps {
  equipeId: string;
}

export const useGetMembro = ({ equipeId }: UseGetMembroProps) => {
  return useQuery({
    queryKey: ["membro", equipeId],
    queryFn: async () => {
      const response = await client.api.equipe[":equipeId"].$get({
        param: { equipeId },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar o membro da equipe.");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
