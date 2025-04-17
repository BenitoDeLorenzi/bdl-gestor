import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

import { EquipeView } from "@/features/equipe/components/equipe-view";

const EquipePage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/");

  return <EquipeView />;
};

export default EquipePage;
