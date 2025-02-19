import { useMemo } from "react"

import { ArrowDownIcon, ArrowUpIcon, CircleIcon, RadiobuttonIcon } from "@radix-ui/react-icons"

import { type Table } from "@tanstack/react-table"

import { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MapsSortOption {
    value: keyof KZProfileMap
    label: string
}
const sortOptions: MapsSortOption[] = [
    { value: "created_on", label: "Release date" },
    { value: "name", label: "Name" },
    { value: "difficulty", label: "Tier" },
    { value: "bonus_count", label: "Bonus count" },
    { value: "filesize", label: "Filesize" },
    { value: "id", label: "Id" },
]

interface MapsSortingProps<KZProfileMap> {
    table: Table<KZProfileMap>
}

export function MapsSorting<KZProfileMap>({ table }: MapsSortingProps<KZProfileMap>) {
    const tableSortingState = table.getState().sorting[0]

    const tableLastSortingLabel = useMemo(
        () => sortOptions.find((option) => option.value === tableSortingState.id)?.label,
        [tableSortingState.id],
    )

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-dashed">
                    {tableSortingState.desc ? (
                        <ArrowDownIcon className="mr-2 h-4 w-4" />
                    ) : (
                        <ArrowUpIcon className="mr-2 h-4 w-4" />
                    )}
                    {tableLastSortingLabel}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
                {sortOptions.map((sortOption) => {
                    return (
                        <DropdownMenuSub key={sortOption.value}>
                            <DropdownMenuSubTrigger>
                                {sortOption.value === tableSortingState.id ? (
                                    <RadiobuttonIcon className="mr-2 h-4 w-4" />
                                ) : (
                                    <CircleIcon className="mr-2 h-4 w-4" />
                                )}
                                {sortOption.label}
                            </DropdownMenuSubTrigger>

                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        onSelect={() =>
                                            table.setSorting([{ id: sortOption.value, desc: true }])
                                        }
                                    >
                                        {sortOption.value === tableSortingState.id &&
                                        tableSortingState.desc ? (
                                            <RadiobuttonIcon className="mr-2 h-4 w-4" />
                                        ) : (
                                            <CircleIcon className="mr-2 h-4 w-4" />
                                        )}
                                        Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() =>
                                            table.setSorting([
                                                { id: sortOption.value, desc: false },
                                            ])
                                        }
                                    >
                                        {sortOption.value === tableSortingState.id &&
                                        !tableSortingState.desc ? (
                                            <RadiobuttonIcon className="mr-2 h-4 w-4" />
                                        ) : (
                                            <CircleIcon className="mr-2 h-4 w-4" />
                                        )}
                                        Ascending
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MapsSorting
