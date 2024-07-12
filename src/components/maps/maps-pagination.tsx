import { Dispatch, SetStateAction } from "react"

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface MapsPaginationProps {
    pageSize: number
    setPageSize: Dispatch<SetStateAction<number>>
    pageIndex: number
    setPageIndex: Dispatch<SetStateAction<number>>
    pageCount: number
    tablePageSizes: number[]
}

function MapsPagination({
    pageSize,
    setPageSize,
    pageIndex,
    setPageIndex,
    pageCount,
    tablePageSizes,
}: MapsPaginationProps) {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="flex-1 text-sm">
                <div className="flex items-center space-x-2">
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => setPageSize(Number(value))}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {tablePageSizes.map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <p className="text-sm font-medium">Rows per page</p>
                </div>
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center justify-center text-sm font-medium">
                    Page {pageIndex} of {pageCount}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-10 w-10 p-0 lg:flex"
                        onClick={() => setPageIndex(1)}
                        disabled={pageIndex === 1}
                    >
                        <span className="sr-only">Go to first page</span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-10 w-10 p-0"
                        onClick={() => setPageIndex((oldPageIndex) => oldPageIndex - 1)}
                        disabled={pageIndex === 1}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-10 w-10 p-0"
                        onClick={() => setPageIndex((oldPageIndex) => oldPageIndex + 1)}
                        disabled={pageIndex === pageCount}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-10 w-10 p-0 lg:flex"
                        onClick={() => setPageIndex(pageCount)}
                        disabled={pageIndex === pageCount}
                    >
                        <span className="sr-only">Go to last page</span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MapsPagination
