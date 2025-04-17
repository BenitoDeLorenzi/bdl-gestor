import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetShowsProps {
  contratanteId?: string | null;
  status?: string | null;
  ano?: string | null;
  search?: string | null;
  local?: string | null;
  projeto?: string | null;
  page: number;
  totalItems: number;
}

export const useGetShows = ({
  contratanteId,
  status,
  search,
  ano,
  local,
  projeto,
  page,
  totalItems,
}: UseGetShowsProps) => {
  return useQuery({
    queryKey: [
      "shows",
      contratanteId,
      status,
      search,
      ano,
      local,
      projeto,
      page,
      totalItems,
    ],
    queryFn: async () => {
      const response = await client.api.shows.$get({
        query: {
          contratanteId: contratanteId ?? "",
          ano: ano ?? undefined,
          status: status ?? undefined,
          search: search ?? undefined,
          local: local ?? undefined,
          projeto: projeto ?? undefined,
          page: page.toString(),
          totalItems: totalItems.toString(),
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
