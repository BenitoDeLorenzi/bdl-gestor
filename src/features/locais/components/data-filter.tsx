import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectSeparator,
  SelectValue,
} from "@/components/ui/select";
import { ListCheckIcon } from "lucide-react";
import { useLocaisFilters } from "../hooks/use-locais-filters";
import { useGetLocais } from "../api/use-get-locais";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export const DataFilters = () => {
  const [{ search, tipo }, setFilters] = useLocaisFilters();

  const { data, isLoading } = useGetLocais({ page: 1, totalItems: 50 });

  const tiposOptions: { label: string; value: string }[] = (
    data?.documents ?? []
  ).reduce(
    (acc: { label: string; value: string }[], local: { tipo: string }) => {
      if (!acc.some((item) => item.value === local.tipo)) {
        acc.push({ label: local.tipo, value: local.tipo });
      }
      return acc;
    },
    []
  );

  const onTipoChange = (value: string) => {
    setFilters({ tipo: value === "all" ? null : (value as string) });
    setFilters({ page: "1" });
  };

  const onSearchChange = (value: string) => {
    setFilters({ search: value === "" ? null : (value as string) });
    setFilters({ page: "1" });
  };

  if (isLoading) {
    return <Skeleton className="h-8 w-full mr-4" />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-auto">
      <div className="flex gap-2">
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
      </div>
      <Select
        defaultValue={tipo ?? undefined}
        onValueChange={(value) => onTipoChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="Todos tipos" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos tipos</SelectItem>
          <SelectSeparator />
          {tiposOptions?.map((tipo, index) => (
            <SelectItem key={index} value={tipo.value}>
              {tipo.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
