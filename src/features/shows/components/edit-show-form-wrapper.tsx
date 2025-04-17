import { Card, CardContent } from "@/components/ui/card";
import { useGetContratantes } from "@/features/contratantes/api/use-get-contratantes";
import { useGetEquipe } from "@/features/equipe/api/use-get-equipe";
import { Loader } from "lucide-react";
import { useGetLocais } from "@/features/locais/api/use-get-locais";
import { useGetShow } from "../api/use-get-show";
import { EditShowForm } from "./edit-show-form";
import { useGetTipos } from "@/features/tipos/api/use-get-tipos";

interface EditShowFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const EditShowFormWrapper = ({
  onCancel,
  id,
}: EditShowFormWrapperProps) => {
  const { data: initialValues, isLoading: isLoadingInitialValues } = useGetShow(
    { showId: id }
  );
  const { data: contratantes, isLoading: isLoadingContratantes } =
    useGetContratantes({ page: 1, totalItems: 50 });
  const { data: equipe, isLoading: isLoadingEquipe } = useGetEquipe({
    page: 1,
    totalItems: 50,
  });
  const { data: locais, isLoading: isLoadingLocais } = useGetLocais({
    page: 1,
    totalItems: 50,
  });

  const contratantesOptions = contratantes?.documents.map((contratante) => ({
    nome: contratante.nome,
    id: contratante.$id,
  }));

  const equipeOptions = equipe?.documents.map((equipe) => ({
    nome: equipe.nome,
    id: equipe.$id,
  }));

  const locaisOptions = locais?.documents.map((local) => ({
    nome: local.nome,
    id: local.$id,
  }));

  const { data: projetosOptions, isLoading: isLoadingProjetoOptions } =
    useGetTipos({ tipo: "projetos", page: 1, totalItems: 1000 });

  const isLoading =
    isLoadingContratantes ||
    isLoadingEquipe ||
    isLoadingLocais ||
    isLoadingProjetoOptions;

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
    <EditShowForm
      onCancel={onCancel}
      contratanteOptions={contratantesOptions ?? []}
      equipeOptions={equipeOptions ?? []}
      locaisOptions={locaisOptions ?? []}
      initialValues={initialValues}
      projetosOptions={projetosOptions?.documents || []}
    />
  );
};
