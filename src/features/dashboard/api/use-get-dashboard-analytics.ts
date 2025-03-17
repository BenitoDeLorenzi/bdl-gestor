import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

export type DashboardAnalyticsResponseType = InferResponseType<
  (typeof client.api.dashboard)["analytics"][":year"]["$get"],
  200
>;

interface UseGetDashboardAnalyticsProps {
  year: string;
}

export const useGetDashboardAnalytics = ({
  year,
}: UseGetDashboardAnalyticsProps) => {
  return useQuery({
    queryKey: ["dashboard-analytics", year],
    queryFn: async () => {
      const response = await client.api.dashboard["analytics"][":year"].$get({
        param: { year: year },
      });

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw new Error("Falha ao buscar o dados.");
      }

      const { data } = await response.json();

      return data;
    },
  });
};
