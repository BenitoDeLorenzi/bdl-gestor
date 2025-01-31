import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin h-8 w-8" />
      <span className="font-semibold text-muted-foreground">Carregando...</span>
    </div>
  );
};

export default Loading;
