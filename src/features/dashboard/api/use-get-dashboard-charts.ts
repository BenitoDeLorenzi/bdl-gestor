import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

export type DashboardChartsResponseType = InferResponseType<
  (typeof client.api.dashboard)["charts"][":year"]["$get"],
  200
>;

interface UseGetDashboardChartsProps {
  year: string;
}

export const useGetDashboardCharts = ({ year }: UseGetDashboardChartsProps) => {
  return useQuery({
    queryKey: ["dashboard-charts", year],
    queryFn: async () => {
      const response = await client.api.dashboard["charts"][":year"].$get({
        param: { year: year },
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
