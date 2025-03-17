"use client";

import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataCalendar } from "./data-calendar";
import { DataFilters } from "./data-filter";
import { DataKanban } from "./data-kanban";
import { DataTable } from "./data-table";

import { Loader, PlusIcon } from "lucide-react";

import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { useBulkUpdateShow } from "../api/use-bulk-update-show";
import { useCreateShowModal } from "../hooks/use-create-show-modal";
import { useGetShows } from "../api/use-get-shows";
import { useShowsFilters } from "../hooks/use-shows-filters";

import { ShowStatus } from "../types";
import { columns } from "./columns";
import { useGetShowsAnalytics } from "../api/use-get-shows-analytics";
import { Analytics } from "@/components/analytics";

export const ShowsViewSwitcher = () => {
  const { open } = useCreateShowModal();
  const [{ contratanteId, date, search, status, local, projeto }] =
    useShowsFilters();

  const [view, setView] = useQueryState("show-view", {
    defaultValue: "table",
  });

  const { mutate: bulkUpdate } = useBulkUpdateShow();

  const { data: shows, isLoading: isLoadingShows } = useGetShows({
    contratanteId,
    date,
    search,
    status,
    local,
    projeto,
  });

  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetShowsAnalytics();

  const onKanbanChange = useCallback(
    (shows: { $id: string; status: ShowStatus }[]) => {
      bulkUpdate({ json: { shows } });
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      className="flex-1 w-full border rounded-md"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        {/* {analytics && <Analytics data={analytics} />} */}
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Tabela
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendário
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4 mr-2" />
            Novo
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingShows ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={shows?.documents ?? []} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              <DataCalendar data={shows?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0 pb-4">
              <DataKanban
                onChange={onKanbanChange}
                data={shows?.documents ?? []}
              />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
