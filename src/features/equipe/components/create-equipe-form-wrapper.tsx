import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useGetTipos } from "@/features/tipos/api/use-get-tipos";
import { CreateEquipeForm } from "./create-equipe-form";

interface CreateEquipeFormWrapperProps {
  onCancel: () => void;
}

export const CreateEquipeFormWrapper = ({
  onCancel,
}: CreateEquipeFormWrapperProps) => {
  const { data: funcoesOpt, isLoading: isLoadingFuncoesOpt } = useGetTipos({
    tipo: "funcoes",
    page: 1,
    totalItems: 1000,
  });

  const { data: instrumentosOpt, isLoading: isLoadingInstrumentosOpt } =
    useGetTipos({
      tipo: "funcoes",
      page: 1,
      totalItems: 1000,
    });

  const isLoading = isLoadingFuncoesOpt || isLoadingInstrumentosOpt;

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
    <CreateEquipeForm
      onCancel={onCancel}
      funcoesOpt={funcoesOpt?.documents || []}
      instrumentosOpt={instrumentosOpt?.documents || []}
    />
  );
};
