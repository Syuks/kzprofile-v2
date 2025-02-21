import { useMemo, useState } from "react"

import {
    ClockIcon,
    DotsHorizontalIcon,
    FileTextIcon,
    InfoCircledIcon,
    MagnifyingGlassIcon,
    OpenInNewWindowIcon,
    PersonIcon,
    ReloadIcon,
} from "@radix-ui/react-icons"
import { SteamIcon } from "@/components/icons"

import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { lightFormat } from "date-fns"

import { formatDistanceToNowStrictWithOffset } from "@/lib/utils"
import { getSteam64 } from "@/lib/steamid"

import { useLocalSettings } from "@/components/localsettings/localsettings-provider"
import useGlobalBans, { type Ban } from "@/hooks/TanStackQueries/useGlobalBans"
import { fetchGlobalServerById } from "@/hooks/TanStackQueries/useGlobalServerById"

import {
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    OnChangeFn,
    SortingState,
    useReactTable,
    type PaginationState,
} from "@tanstack/react-table"
import { DataTable } from "@/components/datatable/datatable"
import { DataTableColumnHeader } from "@/components/datatable/datatable-header"
import { DataTablePagination } from "@/components/datatable/datatable-pagination"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

function BansForm() {
    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = useMemo(() => {
        const value =
            searchParams.get("search") ||
            searchParams.get("steamid") ||
            searchParams.get("steamid64") ||
            searchParams.get("player") ||
            searchParams.get("value") ||
            searchParams.get("query") ||
            ""

        return getSteam64(value) ?? ""
    }, [searchParams])
    const [searchValue, setSearchValue] = useState(searchQuery)

    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 30,
    })

    const globalBansInfiniteQuery = useGlobalBans(searchQuery, pagination.pageSize)

    const bans = useMemo(() => {
        if (!globalBansInfiniteQuery.data || !globalBansInfiniteQuery.data.pages.length) {
            return []
        }

        if (!globalBansInfiniteQuery.data.pages.flat().length) {
            toast("No bans", {
                description: "There are no bans for this Steam ID.",
            })
        }

        setPagination((oldPagination) => {
            return {
                pageIndex: globalBansInfiniteQuery.data.pages.length - 1,
                pageSize: oldPagination.pageSize,
            }
        })

        return globalBansInfiniteQuery.data.pages.flat()
    }, [globalBansInfiniteQuery.data])

    const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
        const updatedPaginationState =
            typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue

        if (
            globalBansInfiniteQuery.hasNextPage &&
            updatedPaginationState.pageIndex === globalBansInfiniteQuery.data?.pages.length
        ) {
            // Pagination will be set when the data arrives so we don't flash a blank table
            globalBansInfiniteQuery.fetchNextPage()
            return
        }

        setPagination(updatedPaginationState)
    }

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<Ban>()

        return [
            columnHelper.accessor("player_name", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Player" />,
                cell: (props) => {
                    const player_name = props.getValue()
                    return (
                        <Button asChild variant="link" className="max-w-full px-0">
                            <Link to={`/players/${props.row.original.steamid64}`}>
                                <span className="truncate">{player_name}</span>
                            </Link>
                        </Button>
                    )
                },
            }),
            columnHelper.accessor("ban_type", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
                cell: (props) => {
                    const ban_type = props.getValue()

                    return <span className="flex justify-center">{ban_type}</span>
                },
            }),
            columnHelper.accessor("expires_on", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Expires" />,
                cell: (props) => {
                    const [localSettings] = useLocalSettings()
                    const expires_on = props.getValue()

                    return (
                        <span className="flex justify-center">
                            {expires_on === "9999-12-31T23:59:59"
                                ? "Never"
                                : lightFormat(expires_on, localSettings.dateFormat)}
                        </span>
                    )
                },
            }),
            columnHelper.accessor("created_on", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Since" />,
                cell: (props) => {
                    const created_on = props.getValue()

                    return (
                        <span className="flex justify-center">
                            {formatDistanceToNowStrictWithOffset(created_on, {
                                addSuffix: true,
                            })}
                        </span>
                    )
                },
            }),
            columnHelper.accessor("server_id", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Server" />,
                cell: (props) => {
                    const server_id = props.getValue()

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
                            <Button variant="link" onClick={connectToServer}>
                                {server_id}
                            </Button>
                        </div>
                    )
                },
            }),
            columnHelper.display({
                id: "actions",
                cell: (props) => {
                    const ban = props.row.original
                    const navigate = useNavigate()

                    const getBanId = () => {
                        toast("Ban ID:", {
                            description: ban.id,
                        })
                    }

                    const getBanNotes = () => {
                        toast(`Ban notes of ban ID ${ban.id}:`, {
                            description: ban.notes,
                        })
                    }

                    const getBanStats = () => {
                        toast(`Ban stats of ban ID ${ban.id}:`, {
                            description: ban.stats,
                        })
                    }

                    const connectToServer = async () => {
                        const globalServer = await fetchGlobalServerById(ban.server_id)

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
                        const globalServer = await fetchGlobalServerById(ban.server_id)

                        if (!globalServer) {
                            toast.error("Global API", {
                                description: "No server found with this ID.",
                            })
                            return
                        }

                        toast(globalServer.name, {
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
                        const globalServer = await fetchGlobalServerById(ban.server_id)

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
                                    BAN
                                </DropdownMenuLabel>
                                <DropdownMenuItem onSelect={getBanId}>
                                    <InfoCircledIcon className="mr-2 h-4 w-4" />
                                    <span>Get ban ID</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={getBanNotes}>
                                    <FileTextIcon className="mr-2 h-4 w-4" />
                                    <span>View notes</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={getBanStats}>
                                    <FileTextIcon className="mr-2 h-4 w-4" />
                                    <span>View stats</span>
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
                                    <Link to={`/players/${ban.steamid64}`}>
                                        <PersonIcon className="mr-2 h-4 w-4" />
                                        <span>Go to profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        to={`https://steamcommunity.com/profiles/${ban.steamid64}/`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <SteamIcon className="mr-2 h-4 w-4" />
                                        <span>Steam profile</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                },
                size: 48,
            }),
        ]
    }, [])

    const table = useReactTable({
        data: bans,
        columns,
        state: {
            sorting,
            pagination: pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        autoResetPageIndex: false,
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const steamid64 = getSteam64(searchValue)

        if (!steamid64) {
            toast("Invalid Steam ID.", {
                description: "Please input a valid Steam ID.",
            })
            return
        }

        setSearchParams({ search: steamid64 })
    }

    const handleClear = () => {
        setSearchValue("")
        setSearchParams({})
    }

    return (
        <>
            <form
                className="flex h-[350px] flex-col items-center justify-center space-y-6"
                onSubmit={handleSubmit}
            >
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Global bans
                </h2>
                <div className="relative w-full max-w-xl">
                    <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Steam ID"
                        className="border-foreground pl-8"
                        autoFocus
                        type="search"
                    />
                </div>
                <div className="flex space-x-12 pb-12">
                    <Button type="submit" disabled={globalBansInfiniteQuery.isFetching}>
                        {globalBansInfiniteQuery.isFetching && searchQuery !== "" ? (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                        )}
                        Search
                    </Button>
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={handleClear}
                        disabled={globalBansInfiniteQuery.isFetching}
                    >
                        {globalBansInfiniteQuery.isFetching && searchQuery === "" ? (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <ClockIcon className="mr-2 h-4 w-4" />
                        )}
                        Most recent
                    </Button>
                </div>
            </form>
            <Separator />
            <div className="mb-24 py-10">
                <h2 className="scroll-m-20 py-4 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Search results
                </h2>
                <DataTable
                    table={table}
                    columns={columns}
                    loading={globalBansInfiniteQuery.isFetching}
                />
                <DataTablePagination
                    table={table}
                    hasNextPage={globalBansInfiniteQuery.hasNextPage}
                    tablePageSizes={[20, 30, 40, 50, 100]}
                />
            </div>
        </>
    )
}

export default BansForm
