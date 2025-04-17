"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { CustomPagination } from "@/components/custom-pagination";

import { DataFilters } from "./data-filter";
import { DataTable } from "./data-table";
import { columns } from "./columns";

import { Loader, Plus } from "lucide-react";

import { useCreateShowModal } from "../hooks/use-create-show-modal";
import { useGetShows } from "../api/use-get-shows";
import { useShowsFilters } from "../hooks/use-shows-filters";

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 10;

export const ShowsView = () => {
  const searchParams = useSearchParams();
  const { open } = useCreateShowModal();
  const [{ contratanteId, ano, search, status, local, projeto }] =
    useShowsFilters();

  const page = +(searchParams.get("page") ?? DEFAULT_PAGE);
  const totalItems = +(searchParams.get("totalItems") ?? DEFAULT_TOTAL_ITEMS);

  const { data: shows, isLoading: isLoadingShows } = useGetShows({
    contratanteId,
    ano,
    search,
    status,
    local,
    projeto,
    page: page < 1 ? DEFAULT_PAGE : page,
    totalItems: totalItems < 1 ? DEFAULT_TOTAL_ITEMS : totalItems,
  });

  const [totalPages, setTotalPages] = useState(() =>
    Math.ceil((shows?.total ?? 1) / totalItems)
  );

  useEffect(() => {
    if (shows?.total) {
      const newTotalPages = Math.ceil(shows.total / totalItems);
      setTotalPages(newTotalPages);
    } else if (shows?.total === 0) {
      setTotalPages(0);
    }
  }, [ano, shows?.total, totalItems]);

  return (
    <div className="flex-1 w-full border rounded-md">
      <div className="h-full flex flex-col overflow-auto p-4 justify-between">
        {/* Header com filtros e botão */}
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
          {isLoadingShows ? (
            <div className="flex w-full h-full items-center justify-center">
              <Loader className="size-7 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable columns={columns} data={shows?.documents ?? []} />
          )}
        </div>

        <CustomPagination totalItems={totalItems} totalPages={totalPages} />
      </div>
    </div>
  );
};
