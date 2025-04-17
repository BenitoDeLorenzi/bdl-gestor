import { getCurrent } from "@/features/auth/queries";
import { UsuariosView } from "@/features/usuarios/components/usuarios-view";
import { redirect } from "next/navigation";

const UsuariosPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/");

  return <UsuariosView />;
};

export default UsuariosPage;
