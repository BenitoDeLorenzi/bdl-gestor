import { getCurrent } from "@/features/auth/queries";
import { TiposView } from "@/features/tipos/components/tipos-view";
import { redirect } from "next/navigation";

const TiposProjetosPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <TiposView tipo="projetos" />;
};

export default TiposProjetosPage;
