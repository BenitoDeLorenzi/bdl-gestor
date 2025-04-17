import { getCurrent } from "@/features/auth/queries";
import { ContratantesView } from "@/features/contratantes/components/contratantes-view";
import { redirect } from "next/navigation";

const ContratantesPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/");

  return <ContratantesView />;
};

export default ContratantesPage;
