import { useMemo } from "react"

import {
    DotsHorizontalIcon,
    InfoCircledIcon,
    OpenInNewWindowIcon,
    PersonIcon,
} from "@radix-ui/react-icons"

import { Link } from "react-router-dom"

import useGlobalServers from "@/hooks/TanStackQueries/useGlobalServers"
import type { GlobalServer } from "@/hooks/TanStackQueries/useGlobalServerById"

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

function ServersGlobal() {
    const globalServersQuery = useGlobalServers()

    const globalServers = useMemo(() => {
        if (!globalServersQuery.data) {
            return []
        }

        if (!globalServersQuery.data.length) {
            toast("No servers", {
                description: "No global servers found.",
            })
        }

        return globalServersQuery.data
    }, [globalServersQuery.data])

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<GlobalServer>()

        return [
            columnHelper.display({
                id: "favorite",
                cell: (props) => {
                    const server = props.row.original
                    return <FavoriteStar serverIp={`${server.ip}:${server.port}`} />
                },
                size: 36,
            }),
            columnHelper.accessor("name", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
                cell: (props) => {
                    const server = props.row.original
                    return (
                        <Button variant="link" className="max-w-full px-0" asChild>
                            <Link to={`steam://connect/${server.ip}:${server.port}`}>
                                <span className="truncate">{server.name}</span>
                            </Link>
                        </Button>
                    )
                },
            }),
            columnHelper.accessor("ip", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="IP" />,
                cell: (props) => {
                    const server = props.row.original

                    return (
                        <Button variant="link" className="flex justify-center px-0" asChild>
                            <Link to={`steam://connect/${server.ip}:${server.port}`}>
                                {server.ip}:{server.port}
                            </Link>
                        </Button>
                    )
                },
            }),
            columnHelper.display({
                id: "global",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Global" />,
                cell: () => {
                    return (
                        <div className="flex justify-center">
                            <Badge variant="destructive">GLOBAL</Badge>
                        </div>
                    )
                },
            }),
            columnHelper.display({
                id: "plugin",
                header: ({ column }) => <DataTableColumnHeader column={column} title="Plugin" />,
                cell: (props) => {
                    const server = props.row.original

                    let plugin: "gokz" | "kz timer" | undefined = undefined
                    const gokzTags = ["gokz"]
                    const kztTags = ["kz timer", "kzt", "kztimer"]
                    const keywords = server.name.toLowerCase()

                    if (gokzTags.some((el) => keywords.includes(el))) {
                        plugin = "gokz"
                    } else if (kztTags.some((el) => keywords.includes(el))) {
                        plugin = "kz timer"
                    }

                    return (
                        <div className="flex justify-center">
                            {!plugin && <Badge variant="secondary">Unknown</Badge>}
                            {plugin === "gokz" && <Badge variant="outline">GOKZ</Badge>}
                            {plugin === "kz timer" && <Badge variant="default">KZ TIMER</Badge>}
                        </div>
                    )
                },
            }),
            columnHelper.accessor("owner_steamid64", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Owner" />,
                cell: (props) => {
                    const server = props.row.original

                    return (
                        <Button variant="link" className="flex justify-center px-0" asChild>
                            <Link to={`/players/${server.owner_steamid64}`}>
                                {server.owner_steamid64}
                            </Link>
                        </Button>
                    )
                },
            }),
            columnHelper.display({
                id: "actions",
                cell: (props) => {
                    const server = props.row.original

                    const getServerInfo = () => {
                        toast(server.name, {
                            description: (
                                <>
                                    <div>
                                        IP: {server.ip}:{server.port}
                                    </div>
                                    <div>Owner: {server.owner_steamid64}</div>
                                </>
                            ),
                            action: {
                                label: "Connect",
                                onClick: () =>
                                    window.location.replace(
                                        `steam://connect/${server.ip}:${server.port}`,
                                    ),
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
                                    <Link to={`steam://connect/${server.ip}:${server.port}`}>
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
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                },
                size: 48,
            }),
        ]
    }, [])

    const table = useReactTable({
        data: globalServers,
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
                    Global servers
                </h2>
                <DataTable table={table} columns={columns} />
                <DataTablePagination table={table} tablePageSizes={[20, 30, 40, 50, 100]} />
            </div>
        </>
    )
}

export default ServersGlobal
