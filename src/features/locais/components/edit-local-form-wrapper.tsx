import { useGetUfs } from "@/features/shows/api/use-get-ufs";

import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useGetLocal } from "../api/use-get-local";
import { EditLocalForm } from "./edit-local-form";
import { useGetTipos } from "@/features/tipos/api/use-get-tipos";

interface EditLocalFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const EditLocalFormWrapper = ({
  onCancel,
  id,
}: EditLocalFormWrapperProps) => {
  const { data: initialValues, isLoading: isLoadingInitialValues } =
    useGetLocal({
      localId: id,
    });
  const { data: ufs, isLoading: isLoadingUfs } = useGetUfs();
  const { data: locaisOpt, isLoading: isLoadingLocaisOpt } = useGetTipos({
    tipo: "locais",
  });

  const isLoading =
    isLoadingUfs || isLoadingInitialValues || isLoadingLocaisOpt;

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
    <EditLocalForm
      initialValues={initialValues}
      onCancel={onCancel}
      ufs={ufs || []}
      locaisOpt={locaisOpt?.documents || []}
    />
  );
};
