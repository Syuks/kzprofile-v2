import { useMemo, useState } from "react"

import { DotsHorizontalIcon, FrameIcon, StretchHorizontallyIcon } from "@radix-ui/react-icons"

import { useOutletContext, useSearchParams } from "react-router-dom"

import { lightFormat } from "date-fns"

import { fetchGlobalServerById } from "@/hooks/TanStackQueries/useGlobalServerById"
import usePlayerJumpstats, {
    type Jumpstat,
    type CrouchbindMode,
    crouchbindModeSchema,
    refetchPlayerJumpstats,
} from "@/hooks/TanStackQueries/usePlayerJumpstats"

import { DataTable } from "@/components/datatable/datatable"
import { DataTablePagination } from "@/components/datatable/datatable-pagination"
import { DataTableColumnHeader } from "@/components/datatable/datatable-header"

import { cn } from "@/lib/utils"
import { JumpTypeLabel, getJumpStatData, getJumpTypeData, jumpTypeLabelSchema } from "@/lib/gokz"

import { useLocalSettings } from "@/components/localsettings/localsettings-provider"

import { PlayerProfileOutletContext } from "."

import {
    createColumnHelper,
    ColumnFiltersState,
    SortingState,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
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
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import DataTableReloadButton from "@/components/datatable/datatable-reload-button"

const columnHelper = createColumnHelper<Jumpstat>()

const columns = [
    columnHelper.display({
        id: "tier",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tier" />,
        cell: (props) => {
            const jumpStatData = getJumpStatData(
                props.row.original.jump_type,
                Boolean(props.row.original.is_crouch_boost),
                props.row.original.distance,
            )

            return (
                <span className={cn("flex justify-center", jumpStatData.color)}>
                    {jumpStatData.label}
                </span>
            )
        },
    }),
    columnHelper.accessor("distance", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Distance" />,
        cell: (props) => {
            const distance = props.getValue()
            const jumpStatData = getJumpStatData(
                props.row.original.jump_type,
                Boolean(props.row.original.is_crouch_boost),
                distance,
            )

            return (
                <span className={cn("flex justify-center", jumpStatData.color)}>
                    {distance.toFixed(4)}
                </span>
            )
        },
    }),
    columnHelper.accessor("strafe_count", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Strafes" />,
        cell: (props) => {
            const strafes = props.getValue()
            const jumpStatData = getJumpStatData(
                props.row.original.jump_type,
                Boolean(props.row.original.is_crouch_boost),
                props.row.original.distance,
            )

            return <span className={cn("flex justify-center", jumpStatData.color)}>{strafes}</span>
        },
    }),
    columnHelper.accessor("is_crouch_boost", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Crouchbind" />,
        cell: (props) => {
            const crouchbind = props.getValue()
            const jumpStatData = getJumpStatData(
                props.row.original.jump_type,
                Boolean(crouchbind),
                props.row.original.distance,
            )

            return (
                <span className={cn("flex justify-center", jumpStatData.color)}>
                    {crouchbind ? "Yes" : "No"}
                </span>
            )
        },
    }),
    columnHelper.accessor("created_on", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: (props) => {
            const [localSettings] = useLocalSettings()

            const date = props.getValue()
            const jumpStatData = getJumpStatData(
                props.row.original.jump_type,
                Boolean(props.row.original.is_crouch_boost),
                props.row.original.distance,
            )

            return (
                <span className={cn("flex justify-center", jumpStatData.color)}>
                    {lightFormat(date, localSettings.dateFormat)}
                </span>
            )
        },
    }),
    columnHelper.accessor("server_id", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Server" />,
        cell: (props) => {
            const server_id = props.getValue()
            const jumpStatData = getJumpStatData(
                props.row.original.jump_type,
                Boolean(props.row.original.is_crouch_boost),
                props.row.original.distance,
            )

            const connectToServer = async () => {
                const globalServer = await fetchGlobalServerById(server_id)

                if (!globalServer) {
                    toast("Global API", { description: "No server found with this ID." })
                    return
                }

                toast(globalServer.name, {
                    description: `${globalServer.ip}:${globalServer.port}`,
                    action: {
                        label: "Connect",
                        onClick: () =>
                            window.location.replace(
                                `steam://connect/${globalServer.ip}:${globalServer.port}`,
                            ),
                    },
                })
            }

            return (
                <div className="flex justify-center">
                    <Button variant="link" onClick={connectToServer} className={jumpStatData.color}>
                        {server_id}
                    </Button>
                </div>
            )
        },
    }),
    columnHelper.display({
        id: "actions",
        cell: (props) => {
            const jumpstat = props.row.original

            const getJumpstatId = () => {
                const jumptypeData = getJumpTypeData(jumpstat.jump_type)
                const crouchbind = jumpstat.is_crouch_boost ? "chrouchbinded" : "unbinded"

                toast(`ID of "${jumpstat.distance} ${crouchbind} ${jumptypeData.label}"`, {
                    description: jumpstat.id,
                })
            }

            const getJumpstatMslCount = () => {
                const jumptypeData = getJumpTypeData(jumpstat.jump_type)
                const crouchbind = jumpstat.is_crouch_boost ? "chrouchbinded" : "unbinded"

                toast(`MSL count of "${jumpstat.distance} ${crouchbind} ${jumptypeData.label}"`, {
                    description: jumpstat.msl_count.toString(),
                })
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
                            JUMPSTAT
                        </DropdownMenuLabel>
                        <DropdownMenuItem onSelect={getJumpstatId}>
                            <FrameIcon className="mr-2 h-4 w-4" />
                            <span>Get ID</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={getJumpstatMslCount}>
                            <StretchHorizontallyIcon className="mr-2 h-4 w-4" />
                            <span>Get MSL count</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
        size: 48,
    }),
]

function Jumpstats() {
    // For testing: julianio's id: 76561197998450788
    const { steamid } = useOutletContext<PlayerProfileOutletContext>()
    const [searchParams] = useSearchParams()

    const [currentJumpType, setCurrentJumpType] = useState<JumpTypeLabel>(() => {
        const value =
            searchParams.get("jumptype") ||
            searchParams.get("jumpstat") ||
            searchParams.get("jump") ||
            searchParams.get("stat")

        const result = jumpTypeLabelSchema.safeParse(value)
        if (result.success) {
            return value as JumpTypeLabel
        }

        return "longjump"
    })
    const [crouchbind, setCrouchbind] = useState<CrouchbindMode>(() => {
        const value = searchParams.get("bind") || searchParams.get("crouchbind")

        const result = crouchbindModeSchema.safeParse(value)
        if (result.success) {
            return value as CrouchbindMode
        }

        return "false"
    })

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([{ id: "distance", desc: true }])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 30,
    })

    const playerJumpstatsInfiniteQuery = usePlayerJumpstats(
        steamid,
        currentJumpType,
        crouchbind,
        pagination.pageSize,
    )

    const playerJumpstats = useMemo(() => {
        if (!playerJumpstatsInfiniteQuery.data || !playerJumpstatsInfiniteQuery.data.pages.length) {
            return []
        }

        if (!playerJumpstatsInfiniteQuery.data.pages.flat().length) {
            toast("No jumpstats", {
                description: "This player has no jumpstats for this jumptype.",
            })
        }

        setPagination((oldPagination) => {
            return {
                pageIndex: playerJumpstatsInfiniteQuery.data.pages.length - 1,
                pageSize: oldPagination.pageSize,
            }
        })

        return playerJumpstatsInfiniteQuery.data.pages.flat()
    }, [playerJumpstatsInfiniteQuery.data])

    const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
        const updatedPaginationState =
            typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue

        if (
            playerJumpstatsInfiniteQuery.hasNextPage &&
            updatedPaginationState.pageIndex === playerJumpstatsInfiniteQuery.data?.pages.length
        ) {
            // Pagination will be set when the data arrives so we don't flash a blank table
            playerJumpstatsInfiniteQuery.fetchNextPage()
            return
        }

        setPagination(updatedPaginationState)
    }

    const table = useReactTable({
        data: playerJumpstats,
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
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        autoResetPageIndex: false,
    })

    return (
        <>
            <div className="flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Jumpstats
                </h2>
                <DataTableReloadButton
                    isFetching={playerJumpstatsInfiniteQuery.isRefetching}
                    refetch={() =>
                        refetchPlayerJumpstats(
                            steamid,
                            currentJumpType,
                            crouchbind,
                            pagination.pageSize,
                        )
                    }
                />
            </div>
            <div className="mb-24">
                <div className="flex items-center py-4">
                    <div className="flex flex-wrap">
                        <div className="mr-4 mt-4 max-w-sm">
                            <Select
                                value={currentJumpType}
                                onValueChange={(value: JumpTypeLabel) => setCurrentJumpType(value)}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Select a jumptype" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Jumptypes</SelectLabel>
                                        <SelectItem value="longjump">Longjump</SelectItem>
                                        <SelectItem value="bhop">Bhop</SelectItem>
                                        <SelectItem value="multibhop">Multibhop</SelectItem>
                                        <SelectItem value="weirdjump">Weirdjump</SelectItem>
                                        <SelectItem value="dropbhop">Dropbhop</SelectItem>
                                        <SelectItem value="countjump">Countjump</SelectItem>
                                        <SelectItem value="ladderjump">Ladderjump</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mr-4 mt-4">
                            <Select
                                value={crouchbind}
                                onValueChange={(value: CrouchbindMode) => setCrouchbind(value)}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Select a jumptype" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Bind</SelectLabel>
                                        <SelectItem value="false">Unbind</SelectItem>
                                        <SelectItem value="true">Crouchbind</SelectItem>
                                        <SelectItem value="both">Both</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DataTable
                    table={table}
                    columns={columns}
                    loading={playerJumpstatsInfiniteQuery.isFetching}
                />
                <DataTablePagination
                    table={table}
                    hasNextPage={playerJumpstatsInfiniteQuery.hasNextPage}
                    tablePageSizes={[10, 20, 30, 40, 50]}
                />
            </div>
        </>
    )
}

export default Jumpstats
