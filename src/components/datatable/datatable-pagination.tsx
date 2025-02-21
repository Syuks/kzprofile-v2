import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons"

import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
    hasNextPage?: boolean
    showPageSizeSelect?: boolean
    tablePageSizes?: number[]
}

export function DataTablePagination<TData>({
    table,
    hasNextPage,
    showPageSizeSelect = true,
    tablePageSizes = [10, 20, 30, 40, 50, 100, 9999],
}: DataTablePaginationProps<TData>) {
    const currentPage = table.getState().pagination.pageIndex
    const rowsPerPage = table.getState().pagination.pageSize
    const totalRows = table.getFilteredRowModel().rows.length

    const firstRowIndex = currentPage * rowsPerPage + 1
    const lastRowIndex = Math.min((currentPage + 1) * rowsPerPage, totalRows)

    return (
        <div className="flex items-center py-4">
            <div className="hidden text-sm md:block">
                <span className=" text-muted-foreground">
                    Showing {firstRowIndex} to {lastRowIndex} of {totalRows}
                </span>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-6 lg:space-x-8">
                {showPageSizeSelect && (
                    <div className="flex items-center space-x-2">
                        <p className="hidden text-sm font-medium sm:block">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {tablePageSizes.map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize === 9999 ? "∞" : pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <div className="flex items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden h-9 w-9 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 p-0"
                        onClick={() => table.nextPage()}
                        disabled={
                            hasNextPage !== undefined ? !hasNextPage : !table.getCanNextPage()
                        }
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden h-9 w-9 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
