import { useMemo, useState } from "react"

import {
    DotsHorizontalIcon,
    MagnifyingGlassIcon,
    ImageIcon,
    PlayIcon,
    PersonIcon,
} from "@radix-ui/react-icons"

import { Link, useNavigate, useOutletContext } from "react-router-dom"

import { lightFormat } from "date-fns"

import type { Unfinishes } from "@/hooks/TanStackQueries/usePlayerProfileKZData"
import { fetchKZProfileMaps } from "@/hooks/TanStackQueries/useKZProfileMaps"

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

import MapHoverCard from "@/components/maps/map-hover-card"
import MapVideoGallery from "@/components/maps/map-video-gallery"

import { getTimeString } from "@/lib/utils"
import { TierID, getTierData } from "@/lib/gokz"

import { useLocalSettings, useRunType } from "@/components/localsettings/localsettings-provider"

import { PlayerProfileOutletContext } from "."

import {
    createColumnHelper,
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
import { toast } from "sonner"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import DataTableReloadButton from "@/components/datatable/datatable-reload-button"

const columnHelper = createColumnHelper<Unfinishes>()

const columns = [
    columnHelper.accessor("map_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Map" />,
        cell: (props) => {
            const map_name = props.getValue()
            return <MapHoverCard mapName={map_name} />
        },
        size: 190,
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
        sortDescFirst: false,
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
        sortDescFirst: true,
        filterFn: dateFilterFunction,
    }),
    columnHelper.accessor("server_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Server" />,
    }),
    columnHelper.display({
        id: "actions",
        cell: (props) => {
            const record = props.row.original
            const navigate = useNavigate()
            const [mapVideos, setMapVideos] = useState<string[]>([])
            const [mapVideosDialogOpen, setMapVideosDialogOpen] = useState(false)

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
                            label: "Google Form",
                            onClick: () =>
                                window.open("https://forms.gle/ZHkcrYPF5amHwwLV9", "_blank"),
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
                                SERVER
                            </DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link to={`/servers?map=${record.map_name}`}>
                                    <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                                    <span>Search servers</span>
                                </Link>
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
        size: 48,
    }),
]

function Unfinishes() {
    const { playerProfileKZData, playerProfileKZDataRefetch, playerProfileKZDataFetching } =
        useOutletContext<PlayerProfileOutletContext>()

    const [runType] = useRunType()

    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: SelectedFilter }>({
        difficulty: { label: "Tier", show: false },
        created_on: { label: "Date", show: false },
    })

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
        if (!playerProfileKZData?.unfinishes[runType]) {
            return []
        }

        return playerProfileKZData.unfinishes[runType]
    }, [playerProfileKZData, runType])

    const table = useReactTable({
        data: tableData,
        columns,
        state: {
            pagination: { pageSize: localSettings.tablePageSize, pageIndex: pageIndex },
        },
        initialState: {
            sorting: [{ id: "created_on", desc: true }],
        },
        enableSortingRemoval: false,
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
                <div className="flex space-x-2">
                    <DatatableAddFiltersDropdown
                        selectedFilters={selectedFilters}
                        onSelectedFiltersChange={handleSelectedFiltersChange}
                    />
                    <DataTableReloadButton
                        isFetching={playerProfileKZDataFetching}
                        refetch={playerProfileKZDataRefetch}
                    />
                </div>
            </div>
            <div className="mb-24">
                <div className="flex items-center justify-between py-4">
                    <div className="flex flex-wrap">
                        <div className="mr-4 mt-4 max-w-sm">
                            <Input
                                placeholder="Search map..."
                                type="search"
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
                <DataTable table={table} columns={columns} loading={playerProfileKZDataFetching} />
                <DataTablePagination table={table} />
            </div>
        </>
    )
}

export default Unfinishes
