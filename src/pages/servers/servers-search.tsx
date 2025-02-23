import { useEffect, useMemo } from "react"

import {
    DotsHorizontalIcon,
    ImageIcon,
    InfoCircledIcon,
    OpenInNewWindowIcon,
    PersonIcon,
} from "@radix-ui/react-icons"

import { Link, useOutletContext, useSearchParams } from "react-router-dom"

import useSteamServers, { type KzProfileServer } from "@/hooks/TanStackQueries/useSteamServers"
import { getMapImageURL } from "@/lib/gokz"
import { ServersOutletContext } from "."

import {
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { DataTable } from "@/components/datatable/datatable"
import { DataTableColumnHeader } from "@/components/datatable/datatable-header"

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
import { DataTablePagination } from "@/components/datatable/datatable-pagination"

function ServersSearch() {
    const { setIsLoading } = useOutletContext<ServersOutletContext>()

    const [searchParams] = useSearchParams()
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

    const kzProfileServersQuery = useSteamServers(searchQuery, !!searchQuery)

    useEffect(() => {
        setIsLoading(kzProfileServersQuery.isFetching)
    }, [kzProfileServersQuery.isFetching])

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
                size: 36,
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
            }),
            columnHelper.accessor("plugin", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Plugin" />,
                cell: (props) => {
                    const server = props.row.original

                    return (
                        <div className="flex justify-center">
                            {!server.plugin && <Badge variant="secondary">Unknown</Badge>}
                            {server.plugin === "gokz" && <Badge variant="outline">GOKZ</Badge>}
                            {server.plugin === "kz timer" && (
                                <Badge variant="default">KZ TIMER</Badge>
                            )}
                        </div>
                    )
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
                            style={{
                                backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("${imageUrl}")`,
                            }}
                            asChild
                        >
                            <Link to={`/maps/${server.map}`}>{server.map}</Link>
                        </Button>
                    )
                },
                size: 190,
            }),
            columnHelper.display({
                id: "actions",
                cell: (props) => {
                    const server = props.row.original

                    const getServerInfo = () => {
                        toast(server.name, {
                            description: (
                                <>
                                    <div>IP: {server.addr}</div>
                                    <div>Owner: {server.owner_steamid64}</div>
                                </>
                            ),
                            action: {
                                label: "Connect",
                                onClick: () =>
                                    window.location.replace(`steam://connect/${server.addr}`),
                            },
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
                                    SERVER
                                </DropdownMenuLabel>
                                <DropdownMenuItem onSelect={getServerInfo}>
                                    <InfoCircledIcon className="mr-2 h-4 w-4" />
                                    <span>Get server info</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={`steam://connect/${server.addr}`}>
                                        <OpenInNewWindowIcon className="mr-2 h-4 w-4" />
                                        <span>Connect to server</span>
                                    </Link>
                                </DropdownMenuItem>
                                {server.owner_steamid64 && (
                                    <DropdownMenuItem asChild>
                                        <Link to={`/players/${server.owner_steamid64}`}>
                                            <PersonIcon className="mr-2 h-4 w-4" />
                                            <span>Go to owner</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link to={`/maps/${server.map}`}>
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        <span>Go to map</span>
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
        data: servers,
        columns,
        initialState: {
            sorting: [{ id: "name", desc: true }],
            pagination: { pageSize: 20, pageIndex: 0 },
        },
        enableSortingRemoval: false,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        autoResetPageIndex: false,
    })

    return (
        <>
            <div className="mb-24 py-10">
                <h2 className="scroll-m-20 py-4 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Search results
                </h2>
                <DataTable
                    table={table}
                    columns={columns}
                    loading={kzProfileServersQuery.isFetching}
                />
                <DataTablePagination table={table} tablePageSizes={[20, 30, 40, 50, 100]} />
            </div>
        </>
    )
}

export default ServersSearch
