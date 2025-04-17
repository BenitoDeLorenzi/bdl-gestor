import { Skeleton } from "@/components/ui/skeleton";
import { useGetProjetosFinance } from "../api/use-get-projetos-finance";
import { useProjetosFinanceFilters } from "../hooks/use-projetos-finance-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, ListCheck, ListTree } from "lucide-react";
import { ProjetosFinanceStatus } from "../types";
import { useGetProjetoCategorias } from "../api/use-get-projeto-categorias";

interface ProjetoFinanceDataFilterProps {
  projetoId: string;
}

export const ProjetoFinanceDataFilter = ({
  projetoId,
}: ProjetoFinanceDataFilterProps) => {
  const [{ categoria, forma_pagamento, status, tipo }, setFilters] =
    useProjetosFinanceFilters();

  const { data: projetos, isLoading: isLoadingProjetos } =
    useGetProjetosFinance({
      projetoId,
      page: 1,
      totalItems: 100,
    });

  const { data: categorias, isLoading: isLoadingCategorias } =
    useGetProjetoCategorias({
      projetoId: projetoId,
    });

  const categoriasOptions = categorias?.documents.map((categoria) => ({
    value: categoria.nome,
    label: categoria.nome,
  }));

  const onStatusChange = (value: string) => {
    setFilters({ page: "1" });
    setFilters({
      status: value === "all" ? null : (value as ProjetosFinanceStatus),
    });
  };

  const onTipoChange = (value: string) => {
    setFilters({ page: "1" });
    setFilters({
      tipo: value === "all" ? null : (value as string),
    });
  };

  const onCategoriaChange = (value: string) => {
    setFilters({ page: "1" });
    setFilters({
      categoria: value === "all" ? null : (value as string),
    });
  };

  const isLoading = isLoadingProjetos || isLoadingCategorias;

  if (isLoading) {
    return <Skeleton className="w-full h-6" />;
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheck className="size-4 mr-2" />
            <SelectValue placeholder="Todos status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos status</SelectItem>
          <SelectSeparator />
          <SelectItem value={ProjetosFinanceStatus.PENDENTE}>
            Pendente
          </SelectItem>
          <SelectItem value={ProjetosFinanceStatus.PAGO}>Pago</SelectItem>
          <SelectItem value={ProjetosFinanceStatus.CANCELADO}>
            Cancelado
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={tipo ?? undefined}
        onValueChange={(value) => onTipoChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ArrowUpDown className="size-4 mr-2" />
            <SelectValue placeholder="Todos tipos" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos tipos</SelectItem>
          <SelectSeparator />
          <SelectItem value="ENTRADA">Entrada</SelectItem>
          <SelectItem value="SAIDA">Saida</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={categoria ?? undefined}
        onValueChange={(value) => onCategoriaChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListTree className="size-4 mr-2" />
            <SelectValue placeholder="Todas categorias" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas categorias</SelectItem>
          <SelectSeparator />
          {categoriasOptions?.map((categoria, index) => (
            <SelectItem key={index} value={categoria.value}>
              {categoria.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
