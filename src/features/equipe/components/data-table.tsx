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

import { Guitar, Hammer, Plus, TriangleAlert } from "lucide-react";
import DottedSeparator from "@/components/dotted-separator";
import { Input } from "@/components/ui/input";
import { useCreateEquipeModal } from "../hooks/use-create-equipe-modal";
import { Equipe } from "../types";
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
        funcao: isMobile ? false : true,
        telefone: isMobile ? false : true,
        cache_medio: isMobile ? false : true,
        $createdAt: isMobile ? false : true,
      },
    },
  });

  const { open } = useCreateEquipeModal();

  const equipe = data as Equipe[];

  return (
    <div className="">
      <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
        <div className="flex flex-col lg:flex-row w-full lg:w-auto gap-2">
          <Input
            placeholder="Buscar membro da equipe..."
            value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("nome")?.setFilterValue(event.target.value)
            }
            className="max-w-sm h-8"
          />
          <Select
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("funcao")?.setFilterValue([]);
              } else {
                table.getColumn("funcao")?.setFilterValue(value);
              }
            }}
          >
            <SelectTrigger className="w-full lg:w-auto h-8">
              <div className="flex items-center pr-2">
                <Hammer className="size-4 mr-2" />
                <SelectValue placeholder="Todas funções" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas funções</SelectItem>
              {Array.from(
                new Map(equipe.map((item) => [item.funcao, item])).values()
              ).map((item) => (
                <SelectItem key={item.funcao} value={item.funcao}>
                  {item.funcao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => {
              if (value === "all") {
                table.getColumn("instrumento")?.setFilterValue([]);
              } else {
                table.getColumn("instrumento")?.setFilterValue(value);
              }
            }}
          >
            <SelectTrigger className="w-full lg:w-auto h-8">
              <div className="flex items-center pr-2">
                <Guitar className="size-4 mr-2" />
                <SelectValue placeholder="Todos instrumentos" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos instrumentos</SelectItem>
              {Array.from(
                new Map(equipe.map((item) => [item.instrumento, item])).values()
              ).map((item) => (
                <SelectItem key={item.instrumento} value={item.instrumento}>
                  {item.instrumento}
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
