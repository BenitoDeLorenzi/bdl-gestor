"use client";

import { Loader, Plus } from "lucide-react";

import { useGetEquipe } from "../api/use-get-equipe";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useSearchParams } from "next/navigation";
import { CustomPagination } from "@/components/custom-pagination";
import { Button } from "@/components/ui/button";
import DottedSeparator from "@/components/dotted-separator";
import { useCreateEquipeModal } from "../hooks/use-create-equipe-modal";
import { DataFilters } from "./data-filter";
import { useEquipeFilters } from "../hooks/use-equipe-filters";
import { useEffect, useState } from "react";

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 12;

export const EquipeView = () => {
  const { open } = useCreateEquipeModal();

  const [{ funcao, instrumento, search }] = useEquipeFilters();
  const searchParams = useSearchParams();

  const page = +(searchParams.get("page") ?? DEFAULT_PAGE);
  const totalItems = +(searchParams.get("totalItems") ?? DEFAULT_TOTAL_ITEMS);

  const { data: equipe, isLoading: isLoadingEquipe } = useGetEquipe({
    page,
    totalItems,
    funcao: funcao || "",
    instrumento: instrumento || "",
    search: search || "",
  });

  const [totalPages, setTotalPages] = useState(() =>
    Math.ceil((equipe?.total ?? 1) / totalItems)
  );

  useEffect(() => {
    if (equipe?.total) {
      const newTotalPages = Math.ceil(equipe.total / totalItems);
      setTotalPages(newTotalPages);
    } else if (equipe?.total === 0) {
      setTotalPages(0);
    }
  }, [equipe?.total, totalItems]);

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
          {isLoadingEquipe ? (
            <div className="flex w-full h-full items-center justify-center">
              <Loader className="size-7 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DataTable columns={columns} data={equipe?.documents ?? []} />
          )}
        </div>

        <div className="pt-4">
          <CustomPagination totalItems={totalItems} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};
