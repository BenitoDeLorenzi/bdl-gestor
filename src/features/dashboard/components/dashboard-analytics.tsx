import { CircleCheck, CircleDotDashed, Clock } from "lucide-react";
import { DashboardAnalyticsCard } from "./dashboard-analytics-card";

interface DashboardAnalyticsProps {
  analytics?: {
    confirmado: {
      total: number;
      valor: number;
    };
    pendente: {
      total: number;
      valor: number;
    };
    finalizado: {
      total: number;
      valor: number;
    };
  };
  isLoading: boolean;
}

export const DashboardAnalytics = ({
  analytics,
  isLoading,
}: DashboardAnalyticsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <DashboardAnalyticsCard
          title="Pendentes"
          icon={Clock}
          value={analytics?.pendente.valor || 0}
          color="amber"
          total={analytics?.pendente.total || 0}
          isLoading={isLoading}
        />
        <DashboardAnalyticsCard
          title="Confirmados"
          icon={CircleDotDashed}
          value={analytics?.confirmado.valor || 0}
          color="blue"
          total={analytics?.confirmado.total || 0}
          isLoading={isLoading}
        />
        <DashboardAnalyticsCard
          title="Finalizados"
          icon={CircleCheck}
          value={analytics?.finalizado.valor || 0}
          color="green"
          total={analytics?.finalizado.total || 0}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
