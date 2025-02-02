import { useMemo, useState } from "react"

import {
    ClockIcon,
    DotsHorizontalIcon,
    MagnifyingGlassIcon,
    PersonIcon,
} from "@radix-ui/react-icons"
import { SteamIcon } from "@/components/icons"

import { Link, useSearchParams } from "react-router-dom"

import useSteamServers, { type KzProfileServer } from "@/hooks/TanStackQueries/useSteamServers"

import {
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    type PaginationState,
} from "@tanstack/react-table"
import { DataTable } from "@/components/datatable/datatable"
import { DataTableColumnHeader } from "@/components/datatable/datatable-header"

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
import FavoriteStar from "@/components/servers/favorite-star"
import { Badge } from "@/components/ui/badge"
import { getMapImageURL } from "@/lib/gokz"

function ServersForm() {
    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = useMemo(() => {
        return (
            searchParams.get("search") ||
            searchParams.get("server") ||
            searchParams.get("map") ||
            searchParams.get("ip") ||
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

    const kzProfileServersQuery = useSteamServers(searchQuery, !!searchQuery)

    const servers = useMemo(() => {
        if (!kzProfileServersQuery.data) {
            return []
        }

        if (!kzProfileServersQuery.data.length) {
            toast("No servers", {
                description: "No servers found with this parameters.",
            })
        }

        return kzProfileServersQuery.data
    }, [kzProfileServersQuery.data])

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<KzProfileServer>()

        return [
            columnHelper.display({
                id: "favorite",
                cell: (props) => {
                    return <FavoriteStar serverIp={props.row.original.addr} />
                },
                meta: {
                    headerClassName: "w-12",
                },
            }),
            columnHelper.accessor("name", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
                cell: (props) => {
                    const server = props.row.original
                    return (
                        <Button variant="link" className="max-w-full px-0" asChild>
                            <Link to={`steam://connect/${server.addr}`}>
                                <span className="truncate">{server.name}</span>
                            </Link>
                        </Button>
                    )
                },
            }),
            columnHelper.accessor("players", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Players" />,
                cell: (props) => {
                    const server = props.row.original
                    return (
                        <span className="flex justify-center">
                            {server.players}/{server.max_players}
                        </span>
                    )
                },
                meta: {
                    headerClassName: "w-24",
                },
            }),
            columnHelper.accessor("addr", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="IP" />,
                cell: (props) => {
                    const server = props.row.original

                    return (
                        <Button variant="link" className="flex justify-center px-0" asChild>
                            <Link to={`steam://connect/${server.addr}`}>{server.addr}</Link>
                        </Button>
                    )
                },
                meta: {
                    headerClassName: "w-40",
                },
            }),
            columnHelper.accessor("global", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Global" />,
                cell: (props) => {
                    const server = props.row.original
                    return (
                        <div className="flex justify-center">
                            {server.global ? (
                                <Badge variant="destructive">GLOBAL</Badge>
                            ) : (
                                <Badge variant="secondary">Unlisted</Badge>
                            )}
                        </div>
                    )
                },
                meta: {
                    headerClassName: "w-24",
                },
            }),
            columnHelper.accessor("plugin", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Plugin" />,
                cell: (props) => {
                    const server = props.row.original
                    if (!server.plugin) return <Badge variant="secondary">Unknown</Badge>
                    if (server.plugin === "gokz") return <Badge variant="outline">GOKZ</Badge>
                    if (server.plugin === "kz timer")
                        return <Badge variant="default">KZ TIMER</Badge>
                },
                meta: {
                    headerClassName: "w-24",
                },
            }),
            columnHelper.accessor("map", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Map" />,
                cell: (props) => {
                    const server = props.row.original
                    const imageUrl = getMapImageURL(server.map, "webp", "small")

                    return (
                        <Button
                            variant="link"
                            className="relative flex justify-center bg-cover bg-center px-0"
                            style={{ backgroundImage: `url("${imageUrl}")` }}
                            asChild
                        >
                            <Link to={`/maps/${server.map}`}>{server.map}</Link>
                        </Button>
                    )
                },
                meta: {
                    headerClassName: "w-56",
                },
            }),
            columnHelper.display({
                id: "actions",
                cell: () => {
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
                                    <Link to={`/servers`}>
                                        <PersonIcon className="mr-2 h-4 w-4" />
                                        <span>Go to profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/servers" target="_blank" rel="noreferrer">
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
        data: servers,
        columns,
        state: {
            sorting,
            pagination: pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        autoResetPageIndex: false,
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setSearchParams({ search: searchValue })
    }

    const globalServers = async () => {}

    return (
        <>
            <form
                className="flex h-[350px] flex-col items-center justify-center space-y-6"
                onSubmit={handleSubmit}
            >
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Server search
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
                    <Button variant="secondary" type="button" onClick={globalServers}>
                        <ClockIcon className="mr-2 h-4 w-4" />
                        Global servers
                    </Button>
                </div>
            </form>
            <div className="mb-52 py-10">
                <h2 className="scroll-m-20 py-4 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Search results
                </h2>
                <DataTable table={table} columns={columns} />
            </div>
        </>
    )
}

export default ServersForm
