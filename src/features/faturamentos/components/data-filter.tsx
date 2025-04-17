import { useGetContratantes } from "@/features/contratantes/api/use-get-contratantes";
import { useGetLocais } from "@/features/locais/api/use-get-locais";
import { useFaturamentoFilters } from "../hooks/use-faturamento-filters";
import { FaturamentoYearNavigate } from "./faturamento-year-navigate";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectSeparator,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const DataFilter = () => {
  const { data: contratantes, isLoading: isLoadingContratantes } =
    useGetContratantes({ page: 1, totalItems: 1000 });

  const { data: locais, isLoading: isLoadingLocais } = useGetLocais({
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

  const isLoading = isLoadingContratantes || isLoadingLocais;

  const [{ contratante, local, page, ano }, setFilters] =
    useFaturamentoFilters();

  const onContratanteChange = (value: string) => {
    setFilters({ page: "1" });
    setFilters({ contratante: value === "all" ? null : (value as string) });
  };

  const onLocalChange = (value: string) => {
    setFilters({ page: "1" });
    setFilters({ local: value === "all" ? null : (value as string) });
  };

  const onAnoChange = (action: "PREV" | "NEXT" | "TODAY") => {
    const year = parseInt(ano);
    if (action === "PREV") setFilters({ ano: String(year - 1) });
    if (action === "NEXT") setFilters({ ano: String(year + 1) });
    setFilters({ page: "1" });
  };

  if (isLoading) {
    return <Skeleton className="h-8 w-full" />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
      <FaturamentoYearNavigate ano={ano} onNavigate={onAnoChange} />
      {/* <Select
        defaultValue={contratante ?? undefined}
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
      </Select> */}
    </div>
  );
};
