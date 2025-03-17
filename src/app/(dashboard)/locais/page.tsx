import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

import { LocaisView } from "@/features/locais/components/locais-view";

const LocaisPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <LocaisView />;
};

export default LocaisPage;
