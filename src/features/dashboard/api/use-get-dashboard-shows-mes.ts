import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

export type DashboardShowsMesResponseType = InferResponseType<
  (typeof client.api.dashboard)["shows-mes"][":month"]["$get"],
  200
>;

interface UseGetDashboardShowsMesProps {
  month: string;
}

export const useGetDashboardShowsMes = ({
  month,
}: UseGetDashboardShowsMesProps) => {
  return useQuery({
    queryKey: ["dashboard-show-mes", month],
    queryFn: async () => {
      const response = await client.api.dashboard["shows-mes"][":month"].$get({
        param: { month: month },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar o dados dos gráficos.");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
