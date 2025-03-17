import { getCurrent } from "@/features/auth/queries";
import { ContratantesView } from "@/features/contratantes/components/contratantes-view";
import { redirect } from "next/navigation";

const ContratantesPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <ContratantesView />;
};

export default ContratantesPage;
