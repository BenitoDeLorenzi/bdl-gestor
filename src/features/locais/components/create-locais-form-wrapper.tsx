import { useGetUfs } from "@/features/shows/api/use-get-ufs";

import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { CreateLocaisForm } from "./create-locais-form";
import { useGetTipos } from "@/features/tipos/api/use-get-tipos";

interface CreateShowFormWrapperProps {
  onCancel: () => void;
}

export const CreateLocaisFormWrapper = ({
  onCancel,
}: CreateShowFormWrapperProps) => {
  const { data: ufs, isLoading: isLoadingUfs } = useGetUfs();
  const { data: locaisOpt, isLoading: isLoadingLocaisOpt } = useGetTipos({
    tipo: "locais",
  });

  const isLoading = isLoadingUfs || isLoadingLocaisOpt;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateLocaisForm
      onCancel={onCancel}
      ufs={ufs || []}
      locaisOpt={locaisOpt?.documents || []}
    />
  );
};
