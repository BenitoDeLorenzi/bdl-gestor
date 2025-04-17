"use client";

import { Loader, Plus } from "lucide-react";
import { useGetLocais } from "../api/use-get-locais";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useSearchParams } from "next/navigation";
import { CustomPagination } from "@/components/custom-pagination";
import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { useCreateLocaisModal } from "../hooks/use-create-locais-modal";
import { DataFilters } from "./data-filter";
import { useLocaisFilters } from "../hooks/use-locais-filters";
import { useEffect, useState } from "react";

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 12;

export const LocaisView = () => {
  const { open } = useCreateLocaisModal();

  const searchParams = useSearchParams();
  const [{ search, tipo }] = useLocaisFilters();

  const page = +(searchParams.get("page") ?? DEFAULT_PAGE);
  const totalItems = +(searchParams.get("totalItems") ?? DEFAULT_TOTAL_ITEMS);

  const { data: locais, isLoading: isLoadingLocais } = useGetLocais({
    page: page < 1 || tipo ? DEFAULT_PAGE : page,
    totalItems: totalItems < 1 ? DEFAULT_TOTAL_ITEMS : totalItems,
    tipo: tipo || "",
    search: search || "",
  });

  const [totalPages, setTotalPages] = useState(() =>
    Math.ceil((locais?.total ?? 1) / totalItems)
  );

  useEffect(() => {
    if (locais?.total) {
      const newTotalPages = Math.ceil(locais.total / totalItems);
      setTotalPages(newTotalPages);
    } else if (locais?.total === 0) {
      setTotalPages(0);
    }
  }, [locais?.total, totalItems]);

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
          {isLoadingLocais ? (
            <div className="flex w-full h-full items-center justify-center">
              <Loader className="size-7 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable columns={columns} data={locais?.documents ?? []} />
          )}
        </div>

        <div className="pt-4">
          <CustomPagination totalItems={totalItems} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

{
  /*  */
}
