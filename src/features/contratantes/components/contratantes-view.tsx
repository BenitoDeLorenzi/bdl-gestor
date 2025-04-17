"use client";

import { Loader, Plus } from "lucide-react";
import { useGetContratantes } from "../api/use-get-contratantes";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { CustomPagination } from "@/components/custom-pagination";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import DottedSeparator from "@/components/dotted-separator";
import { useCreateContratantesModal } from "../hooks/use-create-contratantes-modal";
import { DataFilters } from "./data-filter";
import { useContratantesFilter } from "../hooks/use-contratantes-filters";
import { useEffect, useState } from "react";

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 12;

export const ContratantesView = () => {
  const { open } = useCreateContratantesModal();
  const searchParams = useSearchParams();
  const [{ search }] = useContratantesFilter();

  const page = +(searchParams.get("page") ?? DEFAULT_PAGE);
  const totalItems = +(searchParams.get("totalItems") ?? DEFAULT_TOTAL_ITEMS);

  const { data: contratantes, isLoading: isLoadingContratantes } =
    useGetContratantes({
      page,
      totalItems,
      search: search || "",
    });

  const [totalPages, setTotalPages] = useState(() =>
    Math.ceil((contratantes?.total ?? 1) / totalItems)
  );

  useEffect(() => {
    if (contratantes?.total) {
      const newTotalPages = Math.ceil(contratantes.total / totalItems);
      setTotalPages(newTotalPages);
    } else if (contratantes?.total === 0) {
      setTotalPages(0);
    }
  }, [contratantes?.total, totalItems]);

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
          {isLoadingContratantes ? (
            <div className="flex w-full h-full items-center justify-center">
              <Loader className="size-7 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable columns={columns} data={contratantes?.documents ?? []} />
          )}
        </div>

        <div className="pt-4">
          <CustomPagination totalItems={totalItems} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};
