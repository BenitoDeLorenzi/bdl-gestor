import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useGetProjetoFinance } from "../api/use-get-projeto-finance";
import { EditProjetosFinanceForm } from "./edit-projeto-finance-form";

interface EditProjetoFinanceFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const EditProjetoFinanceFormWrapper = ({
  onCancel,
  id,
}: EditProjetoFinanceFormWrapperProps) => {
  const { data: initialValues, isLoading: isLoadingInitialValues } =
    useGetProjetoFinance({
      financeId: id,
    });

  const isLoading = isLoadingInitialValues;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <EditProjetosFinanceForm
      onCancel={onCancel}
      initialValues={initialValues}
    />
  );
};
