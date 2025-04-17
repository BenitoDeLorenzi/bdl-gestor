import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

import { FaturamentosView } from "@/features/faturamentos/components/faturamentos-view";

const FaturamentoPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/");

  return <FaturamentosView />;
};

export default FaturamentoPage;
