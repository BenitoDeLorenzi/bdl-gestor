import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// Modais agrupados
import { CreateShowModal } from "@/features/shows/components/create-show-modal";
import { EditShowModal } from "@/features/shows/components/edit-show-modal";
import { CreateEquipeModal } from "@/features/equipe/components/create-equipe-modal";
import { CreateContratantesModal } from "@/features/contratantes/components/create-equipe-modal";
import { CreateLocaisModal } from "@/features/locais/components/create-locais-modal";
import { EditLocalModal } from "@/features/locais/components/edit-local-modal";
import { EditContratanteModal } from "@/features/contratantes/components/edit-contratante-modal";
import { EditEquipeModal } from "@/features/equipe/components/edit-equipe-modal";
import { FinalizarShowModal } from "@/features/shows/components/finalizar-show-modal";
import { CreateTiposModal } from "@/features/tipos/components/create-tipos-modal";
import { EditTipoModal } from "@/features/tipos/components/edit-tipo-modal";
import { CreateUsuariosModal } from "@/features/usuarios/components/create-usuarios-modal";
import { CreateProjetosModal } from "@/features/projetos/components/create-equipe-modal";
import { CreateProjetoFinanceModal } from "@/features/projetos/components/create-projeto-finance-modal";
import { EditProjetoFinanceModal } from "@/features/projetos/components/edit-projeto-finance-modal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen">
      {/* Modais globais */}
      <CreateEquipeModal />
      <CreateContratantesModal />
      <CreateShowModal />
      <CreateLocaisModal />
      <CreateTiposModal />
      <CreateUsuariosModal />
      <CreateProjetosModal />
      <CreateProjetoFinanceModal />

      <EditShowModal />
      <EditLocalModal />
      <EditContratanteModal />
      <EditEquipeModal />
      <EditTipoModal />
      <EditProjetoFinanceModal />

      <FinalizarShowModal />

      {/* Layout principal */}
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="w-full">
          <Navbar />
          <main className="h-full py-6 px-3 flex flex-col">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
