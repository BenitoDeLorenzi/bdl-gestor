import { useGetContratantes } from "@/features/contratantes/api/use-get-contratantes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectSeparator,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, Hammer, ListCheckIcon, MapPin } from "lucide-react";
import { ShowStatus } from "../types";
import { useShowsFilters } from "../hooks/use-shows-filters";
import { useGetLocais } from "@/features/locais/api/use-get-locais";
import { useGetTipos } from "@/features/tipos/api/use-get-tipos";
import { ShowsYearNavigate } from "./shows-year-navigate";
import { Skeleton } from "@/components/ui/skeleton";

export const DataFilters = () => {
  const { data: contratantes, isLoading: isLoadingContratantes } =
    useGetContratantes({ page: 1, totalItems: 1000 });

  const { data: locais, isLoading: isLoadingLocais } = useGetLocais({
    page: 1,
    totalItems: 1000,
  });

  const { data: projetos, isLoading: isLoadingProjetos } = useGetTipos({
    tipo: "projetos",
    page: 1,
    totalItems: 1000,
  });

  const contratantesOptions = contratantes?.documents.map((c) => ({
    value: c.$id,
    label: c.nome,
  }));

  const locaisOptions = locais?.documents.map((c) => ({
    value: c.$id,
    label: c.nome,
  }));

  const projetosOptions = projetos?.documents.map((c) => ({
    value: c.nome,
    label: c.nome,
  }));

  const isLoading =
    isLoadingContratantes || isLoadingLocais || isLoadingProjetos;

  const [{ status, contratanteId, local, ano, projeto }, setFilters] =
    useShowsFilters();

  const onStatusChange = (value: string) => {
    setFilters({ page: "1" });
    setFilters({ status: value === "all" ? null : (value as ShowStatus) });
  };

  const onContratanteChange = (value: string) => {
    setFilters({ page: "1" });
    setFilters({ contratanteId: value === "all" ? null : (value as string) });
  };

  const onLocalChange = (value: string) => {
    setFilters({ page: "1" });
    setFilters({ local: value === "all" ? null : (value as string) });
  };

  const onProjetosChange = (value: string) => {
    setFilters({ page: "1" });
    setFilters({ projeto: value === "all" ? null : (value as string) });
  };

  const onAnoChange = (action: "PREV" | "NEXT" | "TODAY") => {
    const year = parseInt(ano);
    if (action === "PREV") setFilters({ ano: String(year - 1) });
    if (action === "NEXT") setFilters({ ano: String(year + 1) });
    setFilters({ page: "1" });
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-full mr-4" />;
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2 w-full">
      <ShowsYearNavigate ano={ano} onNavigate={onAnoChange} />
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="Todos status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos status</SelectItem>
          <SelectSeparator />
          <SelectItem value={ShowStatus.PENDENTE}>Pendente</SelectItem>
          <SelectItem value={ShowStatus.CONFIRMADO}>Confirmado</SelectItem>
          <SelectItem value={ShowStatus.FINALIZADO}>Finalizado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={contratanteId ?? undefined}
        onValueChange={(value) => onContratanteChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <Briefcase className="size-4 mr-2" />
            <SelectValue placeholder="Todos contratantes" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos contratantes</SelectItem>
          <SelectSeparator />
          {contratantesOptions?.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={local ?? undefined}
        onValueChange={(value) => onLocalChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <MapPin className="size-4 mr-2" />
            <SelectValue placeholder="Todos locais" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos locais</SelectItem>
          <SelectSeparator />
          {locaisOptions?.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={projeto ?? undefined}
        onValueChange={(value) => onProjetosChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <Hammer className="size-4 mr-2" />
            <SelectValue placeholder="Todos projetos" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos projetos</SelectItem>
          <SelectSeparator />
          {projetosOptions?.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
