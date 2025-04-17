import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useGetProjetoCategorias } from "../api/use-get-projeto-categorias";
import { CreateProjetoCategoriasForm } from "./create-projeto-categorias-form";

interface CreateProjetosCategoriasWrapperProps {
  onCancel: () => void;
  projetoId: string;
}

export const CreateProjetosCategoriasWrapper = ({
  onCancel,
  projetoId,
}: CreateProjetosCategoriasWrapperProps) => {
  const { data: initialValues, isLoading: isLoadingInitialValues } =
    useGetProjetoCategorias({ projetoId: projetoId });

  const isLoading = isLoadingInitialValues;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-7 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <CreateProjetoCategoriasForm
      onCancel={onCancel}
      initialValues={initialValues.documents}
      projetoId={projetoId}
    />
  );
};
