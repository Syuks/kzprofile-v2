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

import useSteamServers, { type KzProfileServer } from "@/hooks/TanStackQueries/useSteamServers"

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

function ServersForm() {
    const navigate = useNavigate()
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
            columnHelper.accessor("addr", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="IP" />,
            }),
            columnHelper.accessor("global", {
                header: ({ column }) => <DataTableColumnHeader column={column} title="Global" />,
            }),
            columnHelper.display({
                id: "actions",
                cell: (props) => {
                    const server = props.row.original

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
