import { Card, CardContent } from "@/components/ui/card";
import { useGetContratantes } from "@/features/contratantes/api/use-get-contratantes";
import { useGetEquipe } from "@/features/equipe/api/use-get-equipe";
import { Loader } from "lucide-react";
import { CreateShowsForm } from "./create-show-form";
import { useGetLocais } from "@/features/locais/api/use-get-locais";
import { useGetTipos } from "@/features/tipos/api/use-get-tipos";

interface CreateShowFormWrapperProps {
  onCancel: () => void;
}

export const CreateShowFormWrapper = ({
  onCancel,
}: CreateShowFormWrapperProps) => {
  const { data: contratantes, isLoading: isLoadingContratantes } =
    useGetContratantes({ page: 1, totalItems: 1000 });

  const { data: equipe, isLoading: isLoadingEquipe } = useGetEquipe({
    page: 1,
    totalItems: 1000,
  });

  const { data: locais, isLoading: isLoadingLocais } = useGetLocais({
    page: 1,
    totalItems: 1000,
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

  return (
    <CreateShowsForm
      onCancel={onCancel}
      contratanteOptions={contratantesOptions ?? []}
      equipeOptions={equipeOptions ?? []}
      locaisOptions={locaisOptions ?? []}
      projetosOptions={projetosOptions?.documents || []}
    />
  );
};
