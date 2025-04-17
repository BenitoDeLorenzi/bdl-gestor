"use client";

import { Loader } from "lucide-react";
import { useGetFaturamentos } from "../api/use-get-faturamento";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useSearchParams } from "next/navigation";
import { CustomPagination } from "@/components/custom-pagination";
import { DataFilter } from "./data-filter";
import DottedSeparator from "@/components/dotted-separator";
import { useFaturamentoFilters } from "../hooks/use-faturamento-filters";
import { FaturamentoAnalytics } from "./faturamento-analytics";
import { useEffect, useState } from "react";

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 9;

export const FaturamentosView = () => {
  const searchParams = useSearchParams();
  const [{ ano, contratante, local }] = useFaturamentoFilters();

  const page = +(searchParams.get("page") ?? DEFAULT_PAGE);
  const totalItems = +(searchParams.get("totalItems") ?? DEFAULT_TOTAL_ITEMS);

  const { data: faturamentos, isLoading: isLoadingFaturamentos } =
    useGetFaturamentos({ page, totalItems, ano: ano });

  const isLoading = isLoadingFaturamentos;

  const [totalPages, setTotalPages] = useState(() =>
    Math.ceil((faturamentos?.total ?? 1) / totalItems)
  );

  useEffect(() => {
    if (faturamentos?.total) {
      const newTotalPages = Math.ceil(faturamentos.total / totalItems);
      setTotalPages(newTotalPages);
    } else if (faturamentos?.total === 0) {
      setTotalPages(0);
    }
  }, [ano, faturamentos?.total, totalItems]);

  return (
    <div className="flex-1 w-full border rounded-md">
      <div className="h-full flex flex-col overflow-auto p-4">
        <DataFilter />
        <DottedSeparator className="py-3" />
        {faturamentos && <FaturamentoAnalytics ano={ano} />}
        <DottedSeparator className="py-3" />
        <div className="flex-1">
          {isLoading ? (
            <div className="flex w-full h-full items-center justify-center">
              <Loader className="size-7 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable columns={columns} data={faturamentos?.documents ?? []} />
          )}
        </div>

        <div className="pt-4">
          <CustomPagination totalItems={totalItems} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};
