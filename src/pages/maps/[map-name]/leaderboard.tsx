import { useMemo, useState } from "react"

import {
    DotsHorizontalIcon,
    DownloadIcon,
    InfoCircledIcon,
    MagnifyingGlassIcon,
    OpenInNewWindowIcon,
    PersonIcon,
    ReloadIcon,
} from "@radix-ui/react-icons"

import { useOutletContext, Link, useNavigate } from "react-router-dom"

import { lightFormat } from "date-fns"

import { fetchGlobalServerById } from "@/hooks/TanStackQueries/useGlobalServerById"
import { refetchMapTimes, type MapRecordsTop } from "@/hooks/TanStackQueries/useMapTimes"
import { fetchRecordReplay } from "@/hooks/TanStackQueries/useRecordReplay"

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
import {
    DatatableAddFiltersDropdown,
    type SelectedFilter,
} from "@/components/datatable/datatable-add-filters-dropdown"

import { cn, getTimeString } from "@/lib/utils"
import { getPointsColor } from "@/lib/gokz"

import {
    useGameMode,
    useLocalSettings,
    useRunType,
} from "@/components/localsettings/localsettings-provider"

import { MapLayoutOutletContext } from "."

import {
    createColumnHelper,
    useReactTable,
    ColumnFiltersState,
    SortingState,
    PaginationState,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getFacetedUniqueValues,
    getFacetedRowModel,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    OnChangeFn,
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
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

function MapLeaderboard() {
    const [gameMode] = useGameMode()
    const [runType] = useRunType()

    const { mapName, stage, setStage, kzProfileMap, mapTimesInfiniteQuery } =
        useOutletContext<MapLayoutOutletContext>()

    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: SelectedFilter }>({
        stage: { label: "Stage", show: true },
        time: { label: "Time", show: false },
        points: { label: "Points", show: false },
        teleports: { label: "TPs", show: false },
        created_on: { label: "Date", show: false },
        server_name: { label: "Server", show: false },
    })

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 100,
    })

    const mapTimes = useMemo(() => {
        if (!mapTimesInfiniteQuery.data || !mapTimesInfiniteQuery.data.pages.length) {
            return []
        }

        if (!mapTimesInfiniteQuery.data.pages.flat().length) {
            toast("No finishes", {
                description: "This map has no finishes in the game mode and run type.",
            })
        }

        setPagination((oldPagination) => {
            return {
                pageIndex: mapTimesInfiniteQuery.data.pages.length - 1,
                pageSize: oldPagination.pageSize,
            }
        })

        return mapTimesInfiniteQuery.data.pages.flat()
    }, [mapTimesInfiniteQuery.data])

    const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
        const updatedPaginationState =
            typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue

        if (
            mapTimesInfiniteQuery.hasNextPage &&
            updatedPaginationState.pageIndex === mapTimesInfiniteQuery.data?.pages.length
        ) {
            // Pagination will be set when the data arrives so we don't flash a blank table
            mapTimesInfiniteQuery.fetchNextPage()
            return
        }

        setPagination(updatedPaginationState)
    }

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<MapRecordsTop>()

        return [
            columnHelper.accessor("place", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
                cell: (props) => {
                    const place = props.getValue()
                    return place.toLocaleString()
                },
                meta: {
                    headerClassName: "w-12",
                },
            }),
            columnHelper.accessor("player_name", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Player" />,
                cell: (props) => {
                    const player_name = props.getValue()
                    return (
                        <Button asChild variant="link" className="px-0">
                            <Link to={`/players/${props.row.original.steamid64}`}>
                                {player_name}
                            </Link>
                        </Button>
                    )
                },
            }),
            columnHelper.accessor("time", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
                cell: (props) => {
                    const time = props.getValue()

                    return <span className="flex justify-center">{getTimeString(time)}</span>
                },
                filterFn: "inNumberRange",
            }),
            columnHelper.accessor("points", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Points" />,
                cell: (props) => {
                    const points = props.getValue()
                    const pointsColor = getPointsColor(points)

                    return <span className={cn("flex justify-center", pointsColor)}>{points}</span>
                },
                filterFn: "inNumberRange",
            }),
            columnHelper.accessor("teleports", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="TPs" />,
                cell: (props) => {
                    const teleports = props.getValue()

                    return <span className="flex justify-center">{teleports.toLocaleString()}</span>
                },
                filterFn: "inNumberRange",
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
                    const server_name = props.getValue()

                    const connectToServer = async () => {
                        const globalServer = await fetchGlobalServerById(
                            props.row.original.server_id,
                        )

                        if (!globalServer) {
                            toast.error("Global API", {
                                description: "No server found with this ID.",
                            })
                            return
                        }

                        window.location.replace(
                            `steam://connect/${globalServer.ip}:${globalServer.port}`,
                        )
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
                    const record = props.row.original
                    const [runType] = useRunType()
                    const [gameMode] = useGameMode()
                    const navigate = useNavigate()

                    const getRecordId = () => {
                        toast(
                            `${runType.toUpperCase()} run ID of "${record.map_name}" in "${gameMode}"`,
                            {
                                description: record.id,
                            },
                        )
                    }

                    const downloadReplay = async () => {
                        if (record.replay_id === 0) {
                            toast("No replay available", {
                                description: "This run has no replay available.",
                            })
                            return
                        }

                        const recordReplayBlob = await fetchRecordReplay(record.replay_id)

                        toast(`Replay ID: ${record.replay_id}`, {
                            description: `${runType.toUpperCase()} replay of "${record.map_name}" in "${gameMode}"`,
                            action: {
                                label: "Download",
                                onClick: () => {
                                    const file = window.URL.createObjectURL(recordReplayBlob)
                                    window.location.assign(file)
                                },
                            },
                        })
                    }

                    const connectToServer = async () => {
                        const globalServer = await fetchGlobalServerById(record.server_id)

                        if (!globalServer) {
                            toast.error("Global API", {
                                description: "No server found with this ID.",
                            })
                            return
                        }

                        window.location.replace(
                            `steam://connect/${globalServer.ip}:${globalServer.port}`,
                        )
                    }

                    const getServerInfo = async () => {
                        const globalServer = await fetchGlobalServerById(record.server_id)

                        if (!globalServer) {
                            toast.error("Global API", {
                                description: "No server found with this ID.",
                            })
                            return
                        }

                        toast(record.server_name, {
                            description: `
                                <div>IP: ${globalServer.ip}:${globalServer.port}</div>
                                <div>Owner: ${globalServer.owner_steamid64}</div>
                            `,
                            action: {
                                label: "Connect",
                                onClick: () =>
                                    window.location.replace(
                                        `steam://connect/${globalServer.ip}:${globalServer.port}`,
                                    ),
                            },
                        })
                    }

                    const searchServer = async () => {
                        const globalServer = await fetchGlobalServerById(record.server_id)

                        if (!globalServer) {
                            toast.error("Global API", {
                                description: "No server found with this ID.",
                            })
                            return
                        }

                        navigate(`/servers?ip=${globalServer.ip}:${globalServer.port}`)
                    }

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
                                <DropdownMenuItem onSelect={getRecordId}>
                                    <InfoCircledIcon className="mr-2 h-4 w-4" />
                                    <span>Get run ID</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={downloadReplay}>
                                    <DownloadIcon className="mr-2 h-4 w-4" />
                                    <span>Download replay</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                    SERVER
                                </DropdownMenuLabel>
                                <DropdownMenuItem onSelect={getServerInfo}>
                                    <InfoCircledIcon className="mr-2 h-4 w-4" />
                                    <span>Get server info</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={connectToServer}>
                                    <OpenInNewWindowIcon className="mr-2 h-4 w-4" />
                                    <span>Connect to server</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={searchServer}>
                                    <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                                    <span>Search server</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                    PLAYER
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link to={`/players/${record.steamid64}`}>
                                        <PersonIcon className="mr-2 h-4 w-4" />
                                        <span>Go to player</span>
                                    </Link>
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
    }, [])

    const table = useReactTable({
        data: mapTimes,
        columns,
        state: {
            sorting,
            columnFilters,
            pagination: pagination,
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
        autoResetPageIndex: false,
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
        if (!mapTimes) {
            return []
        }

        const serverNames = mapTimes.map((obj) => obj.server_name)
        const uniqueServerNames = [...new Set(serverNames)]
        return uniqueServerNames.map((name) => {
            return {
                label: name,
                value: name,
            }
        })
    }, [mapTimes])

    return (
        <>
            <div className="flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Leaderboard
                </h2>
                <div className="flex space-x-2">
                    <DatatableAddFiltersDropdown
                        selectedFilters={selectedFilters}
                        onSelectedFiltersChange={handleSelectedFiltersChange}
                    />
                    <Button
                        variant="outline"
                        onClick={() =>
                            refetchMapTimes(mapName, gameMode, runType, stage, pagination.pageSize)
                        }
                        disabled={mapTimesInfiniteQuery.isRefetching}
                    >
                        {mapTimesInfiniteQuery.isRefetching ? (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <ReloadIcon className="mr-2 h-4 w-4" />
                        )}
                        Reload
                    </Button>
                </div>
            </div>
            <div className="mb-52">
                <div className="flex items-center py-4">
                    <div className="flex flex-wrap">
                        <div className="mr-4 mt-4 max-w-sm">
                            <Input
                                placeholder="Search player..."
                                value={
                                    (table.getColumn("player_name")?.getFilterValue() as string) ??
                                    ""
                                }
                                onChange={(event) => {
                                    table
                                        .getColumn("player_name")
                                        ?.setFilterValue(event.target.value)
                                }}
                            />
                        </div>
                        {selectedFilters.stage.show && (
                            <div className="mr-4 mt-4 max-w-sm">
                                <Select
                                    value={String(stage)}
                                    onValueChange={(value: string) => setStage(Number(value))}
                                >
                                    <SelectTrigger className="space-x-2 border-dashed hover:bg-accent hover:text-accent-foreground">
                                        <SelectValue placeholder="Select a stage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="0">Main stage</SelectItem>
                                            {!!kzProfileMap &&
                                                Array.from(
                                                    { length: kzProfileMap.bonus_count },
                                                    (_, index) => (
                                                        <SelectItem
                                                            key={index + 1}
                                                            value={String(index + 1)}
                                                        >
                                                            {`Bonus ${index + 1}`}
                                                        </SelectItem>
                                                    ),
                                                )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {selectedFilters.time.show && (
                            <div className="mr-4 mt-4">
                                <DatatableFacetedMinMaxFilter
                                    column={table.getColumn("time")}
                                    title="Time"
                                    numberFormater={(value) =>
                                        value ? getTimeString(value) : getTimeString(0)
                                    }
                                />
                            </div>
                        )}
                        {selectedFilters.points.show && (
                            <div className="mr-4 mt-4">
                                <DatatableFacetedMinMaxFilter
                                    column={table.getColumn("points")}
                                    title="Points"
                                />
                            </div>
                        )}
                        {selectedFilters.teleports.show && (
                            <div className="mr-4 mt-4">
                                <DatatableFacetedMinMaxFilter
                                    column={table.getColumn("teleports")}
                                    title="TPs"
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
                        {selectedFilters.server_name.show && (
                            <div className="mr-4 mt-4">
                                <DataTableFacetedFilter
                                    options={serverNameFacetedFilterOptions}
                                    column={table.getColumn("server_name")}
                                    title="Server"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <DataTable table={table} columns={columns} />
                <DataTablePagination
                    table={table}
                    hasNextPage={mapTimesInfiniteQuery.hasNextPage}
                    tablePageSizes={[100]}
                />
            </div>
        </>
    )
}

export default MapLeaderboard
