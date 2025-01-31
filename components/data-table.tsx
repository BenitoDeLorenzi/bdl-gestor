/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

const DataTable = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.accessor}
              className={`${col.className} font-semibold`}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{data.map((item) => renderRow(item))}</TableBody>
    </Table>
  );
};

export default DataTable;
