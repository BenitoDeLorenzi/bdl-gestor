import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetLocalProps {
  localId: string;
}

export const useGetLocal = ({ localId }: UseGetLocalProps) => {
  return useQuery({
    queryKey: ["local", localId],
    queryFn: async () => {
      const response = await client.api.locais[":localId"].$get({
        param: { localId },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar o local.");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
