import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useGetContratante } from "../api/use-get-contratante";
import { EditContratantesForm } from "./edit-contratantes-form";

interface EditContratanteFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const EditContratanteFormWrapper = ({
  onCancel,
  id,
}: EditContratanteFormWrapperProps) => {
  const { data: initialValues, isLoading: isLoadingInitialValues } =
    useGetContratante({
      contratanteId: id,
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
    <EditContratantesForm initialValues={initialValues} onCancel={onCancel} />
  );
};
