"use client";

import { CircleCheck, CircleDotDashed, Clock } from "lucide-react";
import { DashboardAnalyticsCard } from "./dashboard-analytics-card";
import { DashboardAnalyticsToolbar } from "./dashboard-analutics-toolbar";
import { useState } from "react";
import { addYears, getYear, subYears } from "date-fns";
import { useGetDashboardAnalytics } from "../api/use-get-dashboard-analytics";

export const DashboardAnalytics = () => {
  const [date, setDate] = useState(new Date());
  const year = getYear(date).toString();

  const { data, isLoading, error } = useGetDashboardAnalytics({ year });

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    setDate((prevDate) => {
      if (action === "PREV") return subYears(prevDate, 1);
      if (action === "NEXT") return addYears(prevDate, 1);
      return new Date();
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="">
        <DashboardAnalyticsToolbar date={date} onNavigate={handleNavigate} />
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <DashboardAnalyticsCard
          title="Pendentes"
          icon={Clock}
          value={data?.pendente.valor || 0}
          color="amber"
          total={data?.pendente.total || 0}
          isLoading={isLoading}
        />
        <DashboardAnalyticsCard
          title="Confirmados"
          icon={CircleDotDashed}
          value={data?.confirmado.valor || 0}
          color="blue"
          total={data?.confirmado.total || 0}
          isLoading={isLoading}
        />
        <DashboardAnalyticsCard
          title="Finalizados"
          icon={CircleCheck}
          value={data?.finalizado.valor || 0}
          color="green"
          total={data?.finalizado.total || 0}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
