import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useGetProjetoCategorias } from "../api/use-get-projeto-categorias";
import { CreateProjetoCategoriasForm } from "./create-projeto-categorias-form";
import { CreateProjetosFinanceForm } from "./create-projeto-finance-form";

interface CreateProjetosFinanceFormWrapperProps {
  onCancel: () => void;
  projetoId: string;
}

export const CreateProjetosFinanceFormWrapper = ({
  onCancel,
  projetoId,
}: CreateProjetosFinanceFormWrapperProps) => {
  const { data: categorias, isLoading: isLoadingCategorias } =
    useGetProjetoCategorias({ projetoId: projetoId });

  const isLoading = isLoadingCategorias;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-7 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateProjetosFinanceForm
      projetoId={projetoId}
      onCancel={onCancel}
      categorias={categorias?.documents || []}
    />
  );
};
