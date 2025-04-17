"use client";

import { useState } from "react";
import { DashboardYearNAvigate } from "./dashboard-year-navigate";
import { DashboardAnalytics } from "./dashboard-analytics";
import { DashboardProjetosChart } from "./dashboard-projetos-chart";
import {
  addMonths,
  addYears,
  getMonth,
  getYear,
  subMonths,
  subYears,
} from "date-fns";
import { useGetDashboardAnalytics } from "../api/use-get-dashboard-analytics";
import { DashboardShowsMesChart } from "./dashboard-shows-mes-chart";
import { DashboardMonthNavigate } from "./dashboard-month-navigate";
import { useGetDashboardCharts } from "../api/use-get-dashboard-charts";
import { useGetDashboardShowsMes } from "../api/use-get-dashboard-shows-mes";
import { DashboardShowsMesList } from "./dashboard-shows-mes-list";
import { DashboardFaturamentoChart } from "./dashboard-faturamento-chart";

export const DashboardView = () => {
  const [dateYear, setDateYear] = useState(new Date());
  const [dateMonth, setDateMonth] = useState(new Date());

  const year = getYear(dateYear).toString();
  const month = `${getYear(dateMonth)}-${(getMonth(dateMonth) + 1)
    .toString()
    .padStart(2, "0")}`;

  const handleYearNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    setDateYear((prevDate) => {
      if (action === "PREV") return subYears(prevDate, 1);
      if (action === "NEXT") return addYears(prevDate, 1);
      return new Date();
    });
  };

  const handleMonthNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    setDateMonth((prevDate) => {
      if (action === "PREV") return subMonths(prevDate, 1);
      if (action === "NEXT") return addMonths(prevDate, 1);
      return new Date();
    });
  };

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetDashboardAnalytics({ year });

  const { data: charts, isLoading: isLoadingCharts } = useGetDashboardCharts({
    year,
  });

  const { data: showsMes, isLoading: isLoadingShowMes } =
    useGetDashboardShowsMes({ month });

  const isLoading = isLoadingAnalytics || isLoadingCharts;

  return (
    <div className="">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col col-span-3 lg:col-span-2">
          <DashboardYearNAvigate
            date={dateYear}
            onNavigate={handleYearNavigate}
          />
          <div className="flex flex-col gap-4">
            <DashboardAnalytics analytics={analytics} isLoading={isLoading} />
            <div className="flex flex-col lg:flex-row gap-4 h-[400px]">
              <div className="flex w-full lg:w-1/3 h-full">
                <DashboardProjetosChart
                  year={year}
                  projetos={charts?.projetos || []}
                  isLoading={isLoading}
                />
              </div>
              <div className="flex w-full lg:w-2/3 h-full">
                <DashboardShowsMesChart
                  showsMensais={charts?.showsMensais || []}
                  isLoading={isLoading}
                  total={charts?.total || 0}
                />
              </div>
            </div>
            <DashboardFaturamentoChart />
          </div>
        </div>
        <div className="flex flex-col col-span-3 lg:col-span-1 gap-2">
          <DashboardMonthNavigate
            date={dateMonth}
            onNavigate={handleMonthNavigate}
          />
          <div className="flex flex-col gap-4">
            <DashboardShowsMesList
              shows={showsMes?.documents || []}
              total={showsMes?.total || 0}
              isLoading={isLoadingShowMes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
