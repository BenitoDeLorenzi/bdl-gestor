import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";

import { EditTipoForm } from "./edit-tipo-form";
import { useGetTipo } from "../api/use-get-tipo";

interface EditTipoFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const EditTipoFormWrapper = ({
  onCancel,
  id,
}: EditTipoFormWrapperProps) => {
  const { data: initialValues, isLoading } = useGetTipo({ tipoId: id });

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

  return <EditTipoForm initialValues={initialValues} onCancel={onCancel} />;
};
