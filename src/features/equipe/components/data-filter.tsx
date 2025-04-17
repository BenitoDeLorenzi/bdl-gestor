import { Input } from "@/components/ui/input";
import { useEquipeFilters } from "../hooks/use-equipe-filters";
import { useGetTipos } from "@/features/tipos/api/use-get-tipos";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Guitar, Hammer } from "lucide-react";

export const DataFilters = () => {
  const [{ search, funcao, instrumento }, setFilters] = useEquipeFilters();

  const { data: funcoes, isLoading: isLoadingFuncoes } = useGetTipos({
    tipo: "funcoes",
    page: 1,
    totalItems: 1000,
  });

  const { data: instrumentos, isLoading: isLoadingInstrumentos } = useGetTipos({
    tipo: "instrumentos",
    page: 1,
    totalItems: 1000,
  });

  const onFuncaoChange = (value: string) => {
    setFilters({ funcao: value === "all" ? null : (value as string) });
    setFilters({ page: "1" });
  };

  const onInstrumentoChange = (value: string) => {
    setFilters({ instrumento: value === "all" ? null : (value as string) });
    setFilters({ page: "1" });
  };

  const onSearchChange = (value: string) => {
    setFilters({ search: value === "" ? null : (value as string) });
    setFilters({ page: "1" });
  };

  const isLoading = isLoadingFuncoes || isLoadingInstrumentos;

  if (isLoading) {
    return <Skeleton className="h-8 w-full mr-4" />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
      <Input
        className="h-8"
        placeholder="Procurar por nome"
        value={search || ""}
        onChange={(e) => onSearchChange(e.target.value)}
        clearable
        onClear={() => {
          setFilters({ search: "" });
        }}
      />
      <Select
        defaultValue={funcao ?? undefined}
        onValueChange={(value) => onFuncaoChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <Hammer className="size-4 mr-2" />
            <SelectValue placeholder="Todas funções" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas funções</SelectItem>
          <SelectSeparator />
          {funcoes?.documents?.map((funcao, index) => (
            <SelectItem key={index} value={funcao.nome}>
              {funcao.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={instrumento ?? undefined}
        onValueChange={(value) => onInstrumentoChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <Guitar className="size-4 mr-2" />
            <SelectValue placeholder="Todos instrumentos" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos tipos</SelectItem>
          <SelectSeparator />
          {instrumentos?.documents?.map((instrumento, index) => (
            <SelectItem key={index} value={instrumento.nome}>
              {instrumento.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
