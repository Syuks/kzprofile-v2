import { useState } from "react"

import {
    DotsHorizontalIcon,
    InfoCircledIcon,
    FrameIcon,
    DownloadIcon,
    OpenInNewWindowIcon,
    MagnifyingGlassIcon,
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
import { DataTableFacetedFilter } from "@/components/datatable/datatable-faceted-filter"
import {
    DataTableDateFilter,
    dateFilterFunction,
} from "@/components/datatable/datatable-date-filter"
import {
    DatatableAddFiltersDropdown,
    type SelectedFilter,
} from "@/components/datatable/datatable-add-filters-dropdown"

import { getTimeString } from "@/lib/utils"
import { TierID, getTierData } from "@/lib/gokz"

import { useLocalSettings, useRunType } from "@/components/localsettings/localsettings-provider"

import { PlayerProfileOutletContext } from "."

import {
    createColumnHelper,
    ColumnFiltersState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    getFacetedUniqueValues,
    getFacetedRowModel,
    PaginationState,
    OnChangeFn,
    getFacetedMinMaxValues,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
        filterFn: (row, id, value) => {
            return value.includes(row.getValue<TierID>(id))
        },
    }),
    columnHelper.accessor("created_on", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: (props) => {
            const [localSettings] = useLocalSettings()

            const date = props.getValue()

            return (
                <span className="flex justify-center">
                    {lightFormat(date, localSettings.dateFormat)}
                </span>
            )
        },
        filterFn: dateFilterFunction,
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
                            RUN
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                            <FrameIcon className="mr-2 h-4 w-4" />
                            <span>Get place</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <InfoCircledIcon className="mr-2 h-4 w-4" />
                            <span>Get run ID</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            <span>Download replay</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                            SERVER
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                            <OpenInNewWindowIcon className="mr-2 h-4 w-4" />
                            <span>Connect to server</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <InfoCircledIcon className="mr-2 h-4 w-4" />
                            <span>Get server ID</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                            <span>Search server</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
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

    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: SelectedFilter }>({
        difficulty: { label: "Tier", show: false },
        created_on: { label: "Date", show: false },
    })

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([{ id: "created_on", desc: true }])
    // For pageSize of pagination:
    const [localSettings, setLocalSettings] = useLocalSettings()
    const [pageIndex, setPageIndex] = useState<number>(0)

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
            columnFilters,
            pagination: { pageSize: localSettings.tablePageSize, pageIndex: pageIndex },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    })

    const handleSelectedFiltersChange = (filter: string, isChecked: boolean) => {
        setSelectedFilters((oldSelectedFilter) => {
            return {
                ...oldSelectedFilter,
                [filter]: {
                    ...oldSelectedFilter[filter],
                    show: isChecked,
                },
            }
        })
        table.getColumn(filter)?.setFilterValue(undefined)
    }

    return (
        <>
            <div className="flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Unfinishes
                </h2>
                <DatatableAddFiltersDropdown
                    selectedFilters={selectedFilters}
                    onSelectedFiltersChange={handleSelectedFiltersChange}
                />
            </div>
            <div className="mb-52">
                <div className="flex items-center justify-between py-4">
                    <div className="flex flex-wrap">
                        <div className="mr-4 mt-4 max-w-sm">
                            <Input
                                placeholder="Search map..."
                                value={
                                    (table.getColumn("map_name")?.getFilterValue() as string) ?? ""
                                }
                                onChange={(event) => {
                                    table.getColumn("map_name")?.setFilterValue(event.target.value)
                                }}
                            />
                        </div>
                        {selectedFilters.difficulty.show && (
                            <div className="mr-4 mt-4">
                                <DataTableFacetedFilter
                                    options={[
                                        { label: "Very Easy", value: 1 },
                                        { label: "Easy", value: 2 },
                                        { label: "Medium", value: 3 },
                                        { label: "Hard", value: 4 },
                                        { label: "Very Hard", value: 5 },
                                        { label: "Extreme", value: 6 },
                                        { label: "Death", value: 7 },
                                    ]}
                                    title="Tier"
                                    column={table.getColumn("difficulty")}
                                />
                            </div>
                        )}
                        {selectedFilters.created_on.show && (
                            <div className="mr-4 mt-4">
                                <DataTableDateFilter
                                    column={table.getColumn("created_on")}
                                    title="Date"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <DataTable table={table} columns={columns} />
                <DataTablePagination table={table} />
            </div>
        </>
    )
}

export default Unfinishes
