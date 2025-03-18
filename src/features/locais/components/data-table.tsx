"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ListCheckIcon, Plus, TriangleAlert } from "lucide-react";
import DottedSeparator from "@/components/dotted-separator";
import { useCreateLocaisModal } from "../hooks/use-create-locais-modal";
import { Locais } from "../types";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const { isMobile } = useSidebar();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility: {
        tipo: isMobile ? false : true,
        $createdAt: isMobile ? false : true,
      },
    },
  });

  const { open } = useCreateLocaisModal();

  const locais = data as Locais[];

  return (
    <div className="">
      <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
        <div className="flex flex-col lg:flex-row w-full lg:w-auto gap-2">
          <Input
            placeholder="Buscar local..."
            value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nome")?.setFilterValue(event.target.value)
            }
            className="max-w-sm h-8"
          />
          <Select
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("tipo")?.setFilterValue([]);
              } else {
                table.getColumn("tipo")?.setFilterValue(value);
              }
            }}
          >
            <SelectTrigger className="w-full lg:w-auto h-8">
              <div className="flex items-center pr-2">
                <ListCheckIcon className="size-4 mr-2" />
                <SelectValue placeholder="Todos tipos" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos tipos</SelectItem>
              {Array.from(
                new Map(locais.map((item) => [item.tipo, item])).values()
              ).map((item) => (
                <SelectItem key={item.tipo} value={item.tipo}>
                  {item.tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
      <DottedSeparator className="my-4" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-y-4 p-7 text-muted-foreground">
                    <TriangleAlert className="size-8" />
                    <p>Sem registros</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="secondary"
          size="xs"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="secondary"
          size="xs"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
