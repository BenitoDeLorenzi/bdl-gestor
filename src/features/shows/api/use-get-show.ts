import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetShowsProps {
  showId: string;
}

export const useGetShow = ({ showId }: UseGetShowsProps) => {
  return useQuery({
    queryKey: ["show", showId],
    queryFn: async () => {
      const response = await client.api.shows[":showId"].$get({
        param: { showId },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar o show.");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
