import { getCurrent } from "@/features/auth/queries";

import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PerfilView } from "@/features/perfil/components/perfil-view";
import { PerfilSessoesView } from "@/features/perfil/components/perfil-sessoes-view";

const PerfilPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/");

  return (
    <div className="w-full lg:max-w-4xl">
      <Tabs defaultValue="perfil">
        <Card className="p-2 flex justify-between items-center">
          <Link href="/dashboard" className="flex gap-2">
            <ChevronLeft />
            <span>Voltar</span>
          </Link>
          <TabsList className="">
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="sessoes">Sessões</TabsTrigger>
          </TabsList>
        </Card>
        <TabsContent value="perfil">
          <PerfilView user={user} />
        </TabsContent>
        <TabsContent value="sessoes">
          <PerfilSessoesView userId={user.$id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerfilPage;
