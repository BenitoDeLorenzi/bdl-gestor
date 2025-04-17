"use client";

import { Loader } from "lucide-react";
import { ProjetosFinanceDataTable } from "./projetos-finance-data-table";
import { projetosFinanceColumns } from "./projetos-finance-columns";
import { CustomPagination } from "@/components/custom-pagination";
import { useSearchParams } from "next/navigation";
import { useGetProjetosFinance } from "../api/use-get-projetos-finance";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import DottedSeparator from "@/components/dotted-separator";
import { ProjetoFinanceDataFilter } from "./projeto-finance-data-filter";
import { useProjetosFinanceFilters } from "../hooks/use-projetos-finance-filters";

interface ProjetosFinanceViewProps {
  projetoId: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 10;

export const ProjetosFinanceView = ({
  projetoId,
}: ProjetosFinanceViewProps) => {
  const searchParams = useSearchParams();
  const page = +(searchParams.get("page") ?? DEFAULT_PAGE);
  const totalItems = +(searchParams.get("totalItems") ?? DEFAULT_TOTAL_ITEMS);

  const [currentPage, setPage] = useQueryState("page");

  const [{ categoria, forma_pagamento, status, tipo }] =
    useProjetosFinanceFilters();

  const { data: projetoFinance, isLoading: isLoadingProjetoFinance } =
    useGetProjetosFinance({
      projetoId,
      page: page < 1 ? DEFAULT_PAGE : page,
      totalItems: totalItems < 1 ? DEFAULT_TOTAL_ITEMS : totalItems,
      categoria: categoria ?? "",
      forma_pagamento: forma_pagamento ?? "",
      status: status ?? "",
      tipo: tipo ?? "",
    });

  const totalPages = Math.ceil((projetoFinance?.total ?? 1) / totalItems);

  const isLoading = isLoadingProjetoFinance;

  useEffect(() => {
    setPage("1");
  }, []);

  return (
    <div className="flex flex-col h-full">
      <ProjetoFinanceDataFilter projetoId={projetoId} />
      <DottedSeparator className="py-2" />
      <div className="flex flex-col h-full justify-between">
        {isLoading ? (
          <div className="flex flex-col w-full h-full items-center justify-center">
            <Loader className="size-7 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ProjetosFinanceDataTable
            columns={projetosFinanceColumns}
            data={projetoFinance?.documents || []}
          />
        )}
        <CustomPagination totalItems={totalItems} totalPages={totalPages} />
      </div>
    </div>
  );
};
