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
    ReloadIcon,
} from "@radix-ui/react-icons"

import { Link, useNavigate, useOutletContext } from "react-router-dom"

import { lightFormat } from "date-fns"

import { fetchGlobalServerById } from "@/hooks/TanStackQueries/useGlobalServerById"
import type { RecordsTopExtended } from "@/hooks/TanStackQueries/usePlayerProfileKZData"
import { fetchRecordPlaceByRunId } from "@/hooks/TanStackQueries/useRecordPlaceByRunId"
import { fetchRecordReplay } from "@/hooks/TanStackQueries/useRecordReplay"
import { fetchKZProfileMaps } from "@/hooks/TanStackQueries/useKZProfileMaps"

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

import MapHoverCard from "@/components/maps/map-hover-card"
import MapVideoGallery from "@/components/maps/map-video-gallery"

import { getTimeString, cn } from "@/lib/utils"
import { TierID, getTierData, getPointsColor } from "@/lib/gokz"

import {
    useGameMode,
    useLocalSettings,
    useRunType,
} from "@/components/localsettings/localsettings-provider"

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
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const columnHelper = createColumnHelper<RecordsTopExtended>()

const columns = [
    columnHelper.accessor("map_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Map" />,
        cell: (props) => {
            const map_name = props.getValue()
            return <MapHoverCard mapName={map_name} />
        },
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
            const server_name = props.getValue()

            const connectToServer = async () => {
                const globalServer = await fetchGlobalServerById(props.row.original.server_id)

                if (!globalServer) {
                    toast.error("Global API", { description: "No server found with this ID." })
                    return
                }

                window.location.replace(`steam://connect/${globalServer.ip}:${globalServer.port}`)
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
            const [mapVideos, setMapVideos] = useState<string[]>([])
            const [mapVideosDialogOpen, setMapVideosDialogOpen] = useState(false)

            const getRecordPlace = async () => {
                const recordPlace = await fetchRecordPlaceByRunId(record.id)

                toast(record.map_name, {
                    description: `Your position in the leaderboard is ${recordPlace}.`,
                })
            }

            const getRecordId = () => {
                toast(`${runType.toUpperCase()} run ID of "${record.map_name}" in "${gameMode}"`, {
                    description: record.id,
                })
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
                    toast.error("Global API", { description: "No server found with this ID." })
                    return
                }

                window.location.replace(`steam://connect/${globalServer.ip}:${globalServer.port}`)
            }

            const getServerInfo = async () => {
                const globalServer = await fetchGlobalServerById(record.server_id)

                if (!globalServer) {
                    toast.error("Global API", { description: "No server found with this ID." })
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
                    toast.error("Global API", { description: "No server found with this ID." })
                    return
                }

                navigate(`/servers?ip=${globalServer.ip}:${globalServer.port}`)
            }

            const goToMapper = async () => {
                const kzProfileMaps = await fetchKZProfileMaps()

                const map = kzProfileMaps.find((kzProfileMap) => kzProfileMap.id === record.map_id)

                if (!map) {
                    toast.error("Global API", { description: "No map found with this ID." })
                    return
                }

                if (!map.mapperNames.length) {
                    toast("No mappers found", {
                        description: "We don't know the mappers of this map. Help us find them!",
                    })
                    return
                }

                if (map.mapperIds[0] === "") {
                    toast("No mapper steamid", {
                        description: "We don't know the steamid of this mapper. Help us find it!",
                    })
                    return
                }

                navigate(`/players/${map.mapperIds[0]}`)
            }

            const watchVideo = async () => {
                const kzProfileMaps = await fetchKZProfileMaps()

                const map = kzProfileMaps.find((kzProfileMap) => kzProfileMap.id === record.map_id)

                if (!map) {
                    toast.error("Global API", { description: "No map found with this ID." })
                    return
                }

                if (!map.videos.length) {
                    toast("No videos found", {
                        description: "We don't have any videos for this map. Help us find one!",
                        action: {
                            label: "Github",
                            onClick: () =>
                                window.open("https://github.com/Syuks/KZProfile", "_blank"),
                        },
                    })
                    return
                }

                setMapVideos(map.videos)
                setMapVideosDialogOpen(true)
            }

            return (
                <Dialog open={mapVideosDialogOpen} onOpenChange={setMapVideosDialogOpen}>
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
                            <DropdownMenuItem onSelect={getRecordPlace}>
                                <FrameIcon className="mr-2 h-4 w-4" />
                                <span>Get place</span>
                            </DropdownMenuItem>
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
                                MAP
                            </DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link to={`/maps/${record.map_name}`}>
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    <span>Go to map</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={goToMapper}>
                                <PersonIcon className="mr-2 h-4 w-4" />
                                <span>Go to mapper</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={watchVideo}>
                                <PlayIcon className="mr-2 h-4 w-4" />
                                <span>Watch video</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="w-[85vw] max-w-screen-xl sm:w-[90vw]">
                        <MapVideoGallery videos={mapVideos} />
                    </DialogContent>
                </Dialog>
            )
        },
        meta: {
            headerClassName: "w-12",
        },
    }),
]

function Finishes() {
    const { playerProfileKZData, playerProfileKZDataRefetch, playerProfileKZDataFetching } =
        useOutletContext<PlayerProfileOutletContext>()

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

    const tableData = useMemo(() => {
        if (!playerProfileKZData?.finishes[runType]) {
            return []
        }

        return playerProfileKZData.finishes[runType]
    }, [playerProfileKZData, runType])

    const table = useReactTable({
        data: tableData,
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
        if (!playerProfileKZData) {
            return []
        }

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
            <div className="flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Finishes
                </h2>
                <div className="flex space-x-2">
                    <DatatableAddFiltersDropdown
                        selectedFilters={selectedFilters}
                        onSelectedFiltersChange={handleSelectedFiltersChange}
                    />
                    <Button
                        variant="outline"
                        onClick={() => playerProfileKZDataRefetch()}
                        disabled={playerProfileKZDataFetching}
                    >
                        {playerProfileKZDataFetching ? (
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
                                placeholder="Search map..."
                                value={
                                    (table.getColumn("map_name")?.getFilterValue() as string) ?? ""
                                }
                                onChange={(event) => {
                                    table.getColumn("map_name")?.setFilterValue(event.target.value)
                                }}
                            />
                        </div>
                        {selectedFilters.points.show && (
                            <div className="mr-4 mt-4">
                                <DatatableFacetedMinMaxFilter
                                    column={table.getColumn("points")}
                                    title="Points"
                                />
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
                <DataTablePagination table={table} />
            </div>
        </>
    )
}

export default Finishes
