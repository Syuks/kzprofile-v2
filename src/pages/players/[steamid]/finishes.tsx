import { useMemo, useState } from "react"

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
    PlusCircledIcon,
} from "@radix-ui/react-icons"

import { Link, useNavigate, useOutletContext } from "react-router-dom"

import { lightFormat } from "date-fns"

import { fetchGlobalServerById } from "@/hooks/TanStackQueries/useGlobalServerById"
import type { RecordsTopExtended } from "@/hooks/TanStackQueries/usePlayerProfileKZData"

import { DataTable } from "@/components/datatable/datatable"
import { DataTablePagination } from "@/components/datatable/datatable-pagination"
import { DataTableColumnHeader } from "@/components/datatable/datatable-header"
import {
    DataTableFacetedFilter,
    DatatableFacetedFilterOption,
} from "@/components/datatable/datatable-faceted-filter"
import { DatatableFacetedMinMaxFilter } from "@/components/datatable/datatable-faceted-min-max-filter"
import {
    DataTableDateFilter,
    dateFilterFunction,
} from "@/components/datatable/datatable-date-filter"

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
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

const columnHelper = createColumnHelper<RecordsTopExtended>()

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

            if (points === 1000)
                return <span className="flex justify-center text-csgo-gold">{points}</span>

            if (points >= 900)
                return <span className="flex justify-center text-csgo-darkred">{points}</span>

            if (points >= 800)
                return <span className="flex justify-center text-csgo-blue">{points}</span>

            if (points >= 700)
                return <span className="flex justify-center text-csgo-lime">{points}</span>

            return <span className="flex justify-center">{points}</span>
        },
        filterFn: "inNumberRange",
    }),
    columnHelper.accessor("time", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
        cell: (props) => {
            const time = props.getValue()

            return <span className="flex justify-center">{getTimeString(time)}</span>
        },
        filterFn: "inNumberRange",
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
        cell: (props) => {
            const navigate = useNavigate()

            const server_name = props.getValue()

            const connectToServer = async () => {
                const globalServer = await fetchGlobalServerById(props.row.original.server_id)

                if (!globalServer) {
                    toast("Global API", { description: "No server found with this ID." })
                    return
                }

                navigate(`steam://connect/${globalServer.ip}:${globalServer.port}`)
            }

            return (
                <Button variant="link" onClick={connectToServer} className="max-w-full">
                    <span className="truncate">{server_name}</span>
                </Button>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue<string>(id))
        },
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

function Finishes() {
    const { playerProfileKZData } = useOutletContext<PlayerProfileOutletContext>()

    const [runType] = useRunType()

    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: SelectedFilter }>({
        points: { label: "Points", show: false },
        time: { label: "Time", show: false },
        difficulty: { label: "Tier", show: false },
        created_on: { label: "Date", show: false },
        server_name: { label: "Server", show: false },
    })

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([{ id: "points", desc: true }])
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
        data: playerProfileKZData.finishes[runType],
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

    const serverNameFacetedFilterOptions: DatatableFacetedFilterOption[] = useMemo(() => {
        const serverNames = playerProfileKZData.finishes[runType].map((obj) => obj.server_name)
        const uniqueServerNames = [...new Set(serverNames)]
        return uniqueServerNames.map((name) => {
            return {
                label: name,
                value: name,
            }
        })
    }, [playerProfileKZData])

    return (
        <>
            <h2 className="mb-4 scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                Finishes
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
                    {selectedFilters.points.show && (
                        <DatatableFacetedMinMaxFilter
                            column={table.getColumn("points")}
                            title="Points"
                        />
                    )}
                    {selectedFilters.time.show && (
                        <DatatableFacetedMinMaxFilter
                            column={table.getColumn("time")}
                            title="Time"
                            numberFormater={(value) =>
                                value ? getTimeString(value) : getTimeString(0)
                            }
                        />
                    )}
                    {selectedFilters.difficulty.show && (
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
                    )}
                    {selectedFilters.created_on.show && (
                        <DataTableDateFilter column={table.getColumn("created_on")} title="Date" />
                    )}
                    {selectedFilters.server_name.show && (
                        <DataTableFacetedFilter
                            options={serverNameFacetedFilterOptions}
                            column={table.getColumn("server_name")}
                            title="Server"
                        />
                    )}
                </div>
                <AddFilters
                    selectedFilters={selectedFilters}
                    onSelectedFiltersChange={handleSelectedFiltersChange}
                />
            </div>
            <DataTable table={table} columns={columns} />
            <DataTablePagination table={table} />
        </>
    )
}

interface SelectedFilter {
    label: string
    show: boolean
}

interface AddFiltersProps {
    selectedFilters: { [key: string]: SelectedFilter }
    onSelectedFiltersChange: (filter: string, isChecked: boolean) => void
}

function AddFilters({ selectedFilters, onSelectedFiltersChange }: AddFiltersProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    Add filter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                {Object.keys(selectedFilters).map((key) => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={key}
                            className="capitalize"
                            checked={selectedFilters[key].show}
                            onCheckedChange={(checked) => onSelectedFiltersChange(key, checked)}
                        >
                            {selectedFilters[key].label}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Finishes
