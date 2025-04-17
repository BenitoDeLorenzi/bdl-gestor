import { getCurrent } from "@/features/auth/queries";
import { TiposView } from "@/features/tipos/components/tipos-view";
import { redirect } from "next/navigation";

const TiposFuncoesPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/");

  return <TiposView tipo="funcoes" />;
};

export default TiposFuncoesPage;
