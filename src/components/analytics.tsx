import { ShowsAnalyticsResponseType } from "@/features/shows/api/use-get-shows-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import DottedSeparator from "./dotted-separator";

export const Analytics = ({ data }: ShowsAnalyticsResponseType) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0 mb-4">
      <div className="w-full flex flex-row ">
        <div className="flex items-center flex-1 ">
          <AnalyticsCard
            title="Total de shows"
            value={data.showsCount}
            variant={data.showsDifference > 0 ? "up" : "down"}
            increaseValue={data.showsDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1 ">
          <AnalyticsCard
            title="Pendentes"
            value={data.pendenteShowsCount}
            variant={data.pendenteShowsDifference > 0 ? "up" : "down"}
            increaseValue={data.pendenteShowsDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1 ">
          <AnalyticsCard
            title="Confirmados"
            value={data.confirmadoShowsCount}
            variant={data.confirmadoShowsDifference > 0 ? "up" : "down"}
            increaseValue={data.confirmadoShowsDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1 ">
          <AnalyticsCard
            title="Finalizados"
            value={data.finalizadoShowsCount}
            variant={data.finalizadoShowsDifference > 0 ? "up" : "down"}
            increaseValue={data.finalizadoShowsDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
