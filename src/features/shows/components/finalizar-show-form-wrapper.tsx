import { Card, CardContent } from "@/components/ui/card";

import { Loader } from "lucide-react";
import { useGetShow } from "../api/use-get-show";
import { FinalizarShowForm } from "./finalizar-show-form";

interface FinalizarShowFormWrapperProps {
  onCancel: () => void;
  id: string;
}

export const FinalizarShowFormWrapper = ({
  onCancel,
  id,
}: FinalizarShowFormWrapperProps) => {
  const { data: show, isLoading: isLoadingShow } = useGetShow({ showId: id });

  const isLoading = isLoadingShow;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!show) {
    return null;
  }

  return <FinalizarShowForm onCancel={onCancel} initialValues={show} />;
};
