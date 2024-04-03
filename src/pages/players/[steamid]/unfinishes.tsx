import { useState } from "react"

import {
    DotsHorizontalIcon,
    DownloadIcon,
    ImageIcon,
    PlayIcon,
    PersonIcon,
} from "@radix-ui/react-icons"

import { Link, useOutletContext } from "react-router-dom"

import { lightFormat } from "date-fns"

import type { Unfinishes } from "@/hooks/TanStackQueries/usePlayerProfileKZData"

import { DataTable } from "@/components/datatable/datatable"
import { DataTablePagination } from "@/components/datatable/datatable-pagination"
import { DataTableColumnHeader } from "@/components/datatable/datatable-header"
import { DataTableViewOptions } from "@/components/datatable/datatable-view-options"

import { getTimeString } from "@/lib/utils"
import { getTierData } from "@/lib/gokz"

import { useLocalSettings, useRunType } from "@/components/localsettings/localsettings-provider"

import { PlayerProfileOutletContext } from "."

import {
    createColumnHelper,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    getFacetedUniqueValues,
    getFacetedRowModel,
    PaginationState,
    OnChangeFn,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

const columnHelper = createColumnHelper<Unfinishes>()

const columns = [
    columnHelper.accessor("map_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Map" />,
        cell: (props) => {
            const map_name = props.getValue()
            return (
                <Button asChild variant="link">
                    <Link to={`/maps/${map_name}`}>{map_name}</Link>
                </Button>
            )
        },
    }),
    columnHelper.accessor("points", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Points" />,
        cell: (props) => {
            const points = props.getValue()

            return <span className="flex justify-center">{points}</span>
        },
    }),
    columnHelper.accessor("time", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
        cell: (props) => {
            const time = props.getValue()

            return <span className="flex justify-center">{getTimeString(time)}</span>
        },
    }),
    columnHelper.accessor("difficulty", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tier" />,
        cell: (props) => {
            const tier = props.getValue()

            const tierData = getTierData(tier)

            return <span className={`flex justify-center ${tierData.color}`}>{tierData.label}</span>
        },
    }),
    columnHelper.accessor("created_on", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: (props) => {
            const [localSettings] = useLocalSettings()

            const date = new Date(props.getValue())

            return (
                <span className="flex justify-center">
                    {lightFormat(date, localSettings.dateFormat)}
                </span>
            )
        },
    }),
    columnHelper.accessor("server_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Server" />,
    }),
    columnHelper.display({
        id: "actions",
        cell: (props) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                            MAP
                        </DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link to={`/maps/${props.row.original.map_name}`}>
                                <ImageIcon className="mr-2 h-4 w-4" />
                                <span>Go to map</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <PlayIcon className="mr-2 h-4 w-4" />
                            <span>Watch video</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            <span>Download WR replay</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <PersonIcon className="mr-2 h-4 w-4" />
                            <span>Go to mapper</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        meta: {
            headerClassName: "w-12",
        },
    }),
]

function Unfinishes() {
    const { playerProfileKZData } = useOutletContext<PlayerProfileOutletContext>()

    const [runType] = useRunType()

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([{ id: "created_on", desc: true }])
    const [pageIndex, setPageIndex] = useState<number>(0)
    const [localSettings, setLocalSettings] = useLocalSettings()

    const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
        const updatedPaginationState =
            typeof updaterOrValue === "function"
                ? updaterOrValue({ pageSize: localSettings.tablePageSize, pageIndex: pageIndex })
                : updaterOrValue

        setPageIndex(updatedPaginationState.pageIndex)
        setLocalSettings({
            tablePageSize: updatedPaginationState.pageSize,
        })
    }

    const table = useReactTable({
        data: playerProfileKZData.unfinishes[runType],
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination: { pageSize: localSettings.tablePageSize, pageIndex: pageIndex },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <>
            <h2 className="mb-4 scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                Unfinishes
            </h2>
            <div className="flex items-center justify-between py-4">
                <div className="flex space-x-4">
                    <div className="max-w-sm">
                        <Input
                            placeholder="Search map..."
                            value={(table.getColumn("map_name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => {
                                table.getColumn("map_name")?.setFilterValue(event.target.value)
                            }}
                        />
                    </div>
                </div>
                <DataTableViewOptions table={table} />
            </div>
            <DataTable table={table} columns={columns} />
            <DataTablePagination table={table} />
        </>
    )
}

export default Unfinishes
