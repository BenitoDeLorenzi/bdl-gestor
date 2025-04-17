"use client";

import { Loader, Plus } from "lucide-react";
import { useGetTipos } from "../api/use-get-tipos";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useCreateTiposModal } from "../hooks/use-create-tipos-modal";
import { Button } from "@/components/ui/button";
import DottedSeparator from "@/components/dotted-separator";
import { CustomPagination } from "@/components/custom-pagination";
import { useSearchParams } from "next/navigation";
import { useTiposFilter } from "../hooks/use-tipos-filters";
import { DataFilters } from "./data-filter";
import { useEffect, useState } from "react";

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 10;

interface TiposProps {
  tipo: "locais" | "funcoes" | "instrumentos" | "projetos";
}

export const TiposView = ({ tipo }: TiposProps) => {
  const { open } = useCreateTiposModal();
  const searchParams = useSearchParams();
  const [{ search }] = useTiposFilter();

  const page = +(searchParams.get("page") ?? DEFAULT_PAGE);
  const totalItems = +(searchParams.get("totalItems") ?? DEFAULT_TOTAL_ITEMS);

  const { data: tipos, isLoading: isLoadingTipos } = useGetTipos({
    tipo: tipo,
    page,
    totalItems,
    search: search || "",
  });

  const isLoading = isLoadingTipos;

  const [totalPages, setTotalPages] = useState(() =>
    Math.ceil((tipos?.total ?? 1) / totalItems)
  );

  useEffect(() => {
    if (tipos?.total) {
      const newTotalPages = Math.ceil(tipos.total / totalItems);
      setTotalPages(newTotalPages);
    } else if (tipos?.total === 0) {
      setTotalPages(0);
    }
  }, [tipos?.total, totalItems]);

  return (
    <div className="flex-1 w-full border rounded-md">
      <div className="h-full flex flex-col overflow-auto p-4 justify-between">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          <DataFilters />
          <Button
            size="sm"
            className="w-full lg:w-auto"
            onClick={open}
            effect="expandIcon"
            icon={Plus}
            iconPlacement="right"
          >
            Novo
          </Button>
        </div>

        <DottedSeparator className="py-4" />

        <div className="flex-1">
          {isLoading ? (
            <div className="flex w-full h-full items-center justify-center">
              <Loader className="size-7 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable columns={columns} data={tipos?.documents ?? []} />
          )}
        </div>

        <div className="pt-4">
          <CustomPagination totalItems={totalItems} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};
