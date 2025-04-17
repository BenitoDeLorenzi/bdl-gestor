import { getCurrent } from "@/features/auth/queries";
import { DashboardView } from "@/features/dashboard/components/dashboard-view";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/");

  return <DashboardView />;
};

export default HomePage;
