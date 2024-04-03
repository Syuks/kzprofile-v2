import { useState } from "react"

import {
    DotsHorizontalIcon,
    InfoCircledIcon,
    FrameIcon,
    DownloadIcon,
    OpenInNewWindowIcon,
    MagnifyingGlassIcon,
    ImageIcon,
} from "@radix-ui/react-icons"

import { Link, useNavigate, useOutletContext } from "react-router-dom"

import { lightFormat } from "date-fns"

import { fetchGlobalServerById } from "@/hooks/TanStackQueries/useGlobalServerById"
import type { RecordsTopExtended } from "@/hooks/TanStackQueries/usePlayerProfileKZData"

import { DataTable } from "@/components/datatable/datatable"
import { DataTablePagination } from "@/components/datatable/datatable-pagination"
import { DataTableColumnHeader } from "@/components/datatable/datatable-header"
import { DataTableViewOptions } from "@/components/datatable/datatable-view-options"

import { getTimeString } from "@/lib/utils"
import { getTierData } from "@/lib/gokz"

import { useLocalSettings, useRunType } from "@/components/localsettings/localsettings-provider"

import { PlayerProfileOutletContext } from "."

import {
    createColumnHelper,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    getFacetedUniqueValues,
    getFacetedRowModel,
    PaginationState,
} from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
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

const columnHelper = createColumnHelper<RecordsTopExtended>()

const columns = [
    columnHelper.accessor("map_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Map" />,
        cell: (props) => {
            const map_name = props.getValue()
            return (
                <Link to={`/maps/${map_name}`} className={buttonVariants({ variant: "link" })}>
                    {map_name}
                </Link>
            )
        },
    }),
    columnHelper.accessor("points", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Points" />,
        cell: (props) => {
            const points = props.getValue()

            if (points === 1000)
                return <span className="flex justify-center text-csgo-gold">{points}</span>

            if (points >= 900)
                return <span className="flex justify-center text-csgo-darkred">{points}</span>

            if (points >= 800)
                return <span className="flex justify-center text-csgo-blue">{points}</span>

            if (points >= 700)
                return <span className="flex justify-center text-csgo-lime">{points}</span>

            return <span className="flex justify-center">{points}</span>
        },
    }),
    columnHelper.accessor("time", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
        cell: (props) => {
            const time = props.getValue()

            return <span className="flex justify-center">{getTimeString(time)}</span>
        },
    }),
    columnHelper.accessor("difficulty", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tier" />,
        cell: (props) => {
            const tier = props.getValue()

            const tierData = getTierData(tier)

            return <span className={`flex justify-center ${tierData.color}`}>{tierData.label}</span>
        },
    }),
    columnHelper.accessor("created_on", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
        cell: (props) => {
            const [localSettings] = useLocalSettings()

            const date = new Date(props.getValue())

            return (
                <span className="flex justify-center">
                    {lightFormat(date, localSettings.dateFormat)}
                </span>
            )
        },
    }),
    columnHelper.accessor("server_name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Server" />,
        cell: (props) => {
            const navigate = useNavigate()

            const server_name = props.getValue()

            const connectToServer = async () => {
                const globalServer = await fetchGlobalServerById(props.row.original.server_id)

                if (!globalServer) {
                    toast("Global API", { description: "No server found with this ID." })
                    return
                }

                navigate(`steam://connect/${globalServer.ip}:${globalServer.port}`)
            }

            return (
                <Button variant="link" onClick={connectToServer} className="max-w-full">
                    <span className="truncate">{server_name}</span>
                </Button>
            )
        },
    }),
    columnHelper.display({
        id: "actions",
        cell: (props) => {
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
                        <DropdownMenuItem>
                            <FrameIcon className="mr-2 h-4 w-4" />
                            <span>Get place</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <InfoCircledIcon className="mr-2 h-4 w-4" />
                            <span>Get run ID</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            <span>Download replay</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                            SERVER
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                            <OpenInNewWindowIcon className="mr-2 h-4 w-4" />
                            <span>Connect to server</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <InfoCircledIcon className="mr-2 h-4 w-4" />
                            <span>Get server ID</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                            <span>Search server</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to={`/maps/${props.row.original.map_name}`}>
                                <ImageIcon className="mr-2 h-4 w-4" />
                                <span>Go to map</span>
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

function Finishes() {
    const { playerProfileKZData } = useOutletContext<PlayerProfileOutletContext>()

    const [runType] = useRunType()

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([{ id: "points", desc: true }])
    const [pagination, setPagination] = useState<PaginationState>({ pageSize: 20, pageIndex: 0 })

    const table = useReactTable({
        data: playerProfileKZData.finishes[runType],
        columns,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (
        <>
            <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                Finishes
            </h2>
            <div className="flex items-center justify-between py-4">
                <div className="flex space-x-4">
                    <div className="max-w-sm">
                        <Input
                            placeholder="Search map..."
                            value={(table.getColumn("map_name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) => {
                                table.getColumn("client_name")?.setFilterValue(event.target.value)
                            }}
                        />
                    </div>
                </div>
                <DataTableViewOptions table={table} />
            </div>
            <DataTable table={table} columns={columns} />
            <DataTablePagination table={table} />
        </>
    )
}

export default Finishes
