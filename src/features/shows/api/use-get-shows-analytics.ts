import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

export type ShowsAnalyticsResponseType = InferResponseType<
  (typeof client.api.shows)["shows"]["analytics"]["$get"],
  200
>;

export const useGetShowsAnalytics = () => {
  return useQuery({
    queryKey: ["shows-analytics"],
    queryFn: async () => {
      const response = await client.api.shows["shows"]["analytics"].$get();

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
