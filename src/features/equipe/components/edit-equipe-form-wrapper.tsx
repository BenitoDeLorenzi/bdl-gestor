import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useGetMembro } from "../api/use-get-membro";
import { EditEquipeForm } from "./edit-equipe-form";
import { useGetTipos } from "@/features/tipos/api/use-get-tipos";

interface EditEquipeFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const EditEquipeFormWrapper = ({
  onCancel,
  id,
}: EditEquipeFormWrapperProps) => {
  const { data: initialValues, isLoading: isLoadingInitialValues } =
    useGetMembro({
      equipeId: id,
    });

  const { data: funcoesOpt, isLoading: isLoadingFuncoesOpt } = useGetTipos({
    tipo: "funcoes",
    page: 1,
    totalItems: 1000,
  });

  const { data: instrumentosOpt, isLoading: isLoadingInstrumentosOpt } =
    useGetTipos({
      tipo: "instrumentos",
      page: 1,
      totalItems: 1000,
    });

  const isLoading =
    isLoadingInitialValues || isLoadingFuncoesOpt || isLoadingInstrumentosOpt;

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
    <EditEquipeForm
      initialValues={initialValues}
      onCancel={onCancel}
      funcoesOpt={funcoesOpt?.documents || []}
      instrumentosOpt={instrumentosOpt?.documents || []}
    />
  );
};
