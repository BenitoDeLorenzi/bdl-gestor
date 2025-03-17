import { DashboardAnalytics } from "./dashboard-analytics";

export const DashboardView = () => {
  return (
    <div className="grid grid-cols-3">
      <div className="flex flex-col col-span-3 lg:col-span-2 gap-2">
        <div className="">
          <DashboardAnalytics />
        </div>
      </div>
    </div>
  );
};
