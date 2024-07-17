import { useMemo, useState } from "react"

import {
    ClockIcon,
    DotsHorizontalIcon,
    MagnifyingGlassIcon,
    PersonIcon,
} from "@radix-ui/react-icons"
import { SteamIcon } from "@/components/icons"

import { Link, useNavigate, useSearchParams } from "react-router-dom"

import { getSteam64 } from "@/lib/steamid"

import useKZPlayers, { type KZPlayerExtended } from "@/hooks/TanStackQueries/useKZPlayers"

import PlayerFlag from "@/components/flag/player-flag"
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetchKZPlayer } from "@/hooks/TanStackQueries/useKZPlayer"

function PlayersSearchForm() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = useMemo(() => {
        return (
            searchParams.get("search") ||
            searchParams.get("player") ||
            searchParams.get("name") ||
            searchParams.get("value") ||
            searchParams.get("query") ||
            ""
        )
    }, [searchParams])
    const [searchValue, setSearchValue] = useState(searchQuery)

    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 30,
    })

    const kzPlayersInfiniteQuery = useKZPlayers(searchQuery, pagination.pageSize, !!searchQuery)

    const kzPlayersExtended = useMemo(() => {
        if (!kzPlayersInfiniteQuery.data || !kzPlayersInfiniteQuery.data.pages.length) {
            return []
        }

        if (!kzPlayersInfiniteQuery.data.pages.flat().length) {
            toast("No players", {
                description: "There are no players with this name.",
            })
        }

        setPagination((oldPagination) => {
            return {
                pageIndex: kzPlayersInfiniteQuery.data.pages.length - 1,
                pageSize: oldPagination.pageSize,
            }
        })

        return kzPlayersInfiniteQuery.data.pages.flat()
    }, [kzPlayersInfiniteQuery.data])

    const onPaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
        const updatedPaginationState =
            typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue

        if (
            kzPlayersInfiniteQuery.hasNextPage &&
            updatedPaginationState.pageIndex === kzPlayersInfiniteQuery.data?.pages.length
        ) {
            // Pagination will be set when the data arrives so we don't flash a blank table
            kzPlayersInfiniteQuery.fetchNextPage()
            return
        }

        setPagination(updatedPaginationState)
    }

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<KZPlayerExtended>()

        return [
            columnHelper.accessor("name", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Player" />,
                cell: (props) => {
                    const player_name = props.getValue()
                    return (
                        <Button asChild variant="link" className="space-x-2 px-0">
                            <Link to={`/players/${props.row.original.steamid}`}>
                                <img src={props.row.original.avatar} className="rounded-full" />
                                <span>{player_name}</span>
                                <PlayerFlag
                                    nationality={props.row.original.loccountrycode}
                                    className="h-8"
                                />
                            </Link>
                        </Button>
                    )
                },
            }),
            columnHelper.accessor("personaname", {
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title="Steam name" />
                ),
                cell: (props) => {
                    const personaname = props.getValue()
                    return (
                        <div className="flex justify-center">
                            <Button asChild variant="link" className="px-0">
                                <Link
                                    to={props.row.original.profileurl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {personaname}
                                </Link>
                            </Button>
                        </div>
                    )
                },
            }),
            columnHelper.accessor("total_records", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Records" />,
                cell: (props) => {
                    const total_records = props.getValue()

                    return <span className="flex justify-center">{total_records}</span>
                },
            }),
            columnHelper.accessor("realname", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Real name" />,
                cell: (props) => {
                    const realname = props.getValue()

                    return <span className="flex justify-center">{realname}</span>
                },
            }),
            columnHelper.accessor("is_banned", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Banned" />,
                cell: (props) => {
                    const is_banned = props.getValue()

                    return <div className="flex justify-center">{is_banned ? "Yes" : "No"}</div>
                },
            }),
            columnHelper.display({
                id: "actions",
                cell: (props) => {
                    const kzPlayerExtended = props.row.original

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
                                    PLAYER
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link to={`/players/${kzPlayerExtended.steamid}`}>
                                        <PersonIcon className="mr-2 h-4 w-4" />
                                        <span>Go to profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link
                                        to={kzPlayerExtended.profileurl}
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
                meta: {
                    headerClassName: "w-12",
                },
            }),
        ]
    }, [])

    const table = useReactTable({
        data: kzPlayersExtended,
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

        if (!!steamid64) {
            navigate(`/players/${steamid64}`)
            return
        }

        setSearchParams({ search: searchValue })
    }

    const handleLucky = async () => {
        const fetchedPlayer = await fetchKZPlayer(searchValue)

        if (!fetchedPlayer) {
            toast("No players", {
                description: "There are no players with this name.",
            })
            return
        }

        navigate(`/players/${fetchedPlayer.steamid64}`)
    }

    return (
        <>
            <form
                className="flex h-[350px] flex-col items-center justify-center space-y-6"
                onSubmit={handleSubmit}
            >
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Player search
                </h2>
                <div className="relative w-full max-w-xl">
                    <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Name, Steam ID, Steam profile"
                        className="border-foreground pl-8"
                        autoFocus
                    />
                </div>
                <div className="flex space-x-12 pb-12">
                    <Button type="submit">
                        <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                    <Button variant="secondary" type="button" onClick={handleLucky}>
                        <ClockIcon className="mr-2 h-4 w-4" />
                        Feel lucky?
                    </Button>
                </div>
            </form>
            <div className="mb-52 py-10">
                <h2 className="scroll-m-20 py-4 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Search results
                </h2>
                <DataTable table={table} columns={columns} />
                <DataTablePagination
                    table={table}
                    hasNextPage={kzPlayersInfiniteQuery.hasNextPage}
                    tablePageSizes={[20, 30, 40, 50, 100]}
                />
            </div>
        </>
    )
}

export default PlayersSearchForm
