import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

// Column type with optional custom render
type Column<T> = {
  header: string;
  accessor: keyof T | string;
  render?: (row: T, index: number) => React.ReactNode;
};

interface BasicTableOneProps<T> {
  columns: Column<T>[];
  data: T[];
}

// Helper function to access nested properties like 'category.name'
const get = (obj: unknown, path: string): unknown =>
  path.split('.').reduce((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), obj);


export default function BasicTableOne<T>({ columns, data }: BasicTableOneProps<T>) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((column, idx) => (
                  <TableCell
                    key={idx}
                    isHeader
                    className="px-2 py-3 font-bold text-gray-500 text-start text-sm dark:text-gray-400"
                  >
                    {column.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => {
                    let content: React.ReactNode;

                    if (column.render) {
                      content = column.render(row, rowIndex);
                    } else {
  const value = get(row, column.accessor as string) as React.ReactNode;
  content =
    React.isValidElement(value) || typeof value !== "object"
      ? value
      : JSON.stringify(value); // Fallback
}


                    return (
                      <TableCell
                        key={colIndex}
                        className="px-2 py-4 text-start text-gray-500 text-sm dark:text-gray-400"
                      >
                        {content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
