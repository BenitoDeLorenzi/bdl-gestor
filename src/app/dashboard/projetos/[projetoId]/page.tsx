import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { ProjetoIdClient } from "./client";

const ProjetosIdPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/");

  return <ProjetoIdClient />;
};

export default ProjetosIdPage;
