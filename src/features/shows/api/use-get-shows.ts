import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetShowsProps {
  contratanteId?: string | null;
  status?: string | null;
  date?: string | null;
  search?: string | null;
  local?: string | null;
  projeto?: string | null;
}

export const useGetShows = ({
  contratanteId,
  status,
  search,
  date,
  local,
  projeto,
}: UseGetShowsProps) => {
  return useQuery({
    queryKey: ["shows", contratanteId, status, search, date, local, projeto],
    queryFn: async () => {
      const response = await client.api.shows.$get({
        query: {
          contratanteId: contratanteId ?? "",
          data: date ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          local: local ?? undefined,
          projeto: projeto ?? undefined,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar os shows");
      }

      const { data } = await response.json();

      return data ?? [];
    },
  });
};
