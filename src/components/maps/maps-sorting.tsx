import { Dispatch, SetStateAction, useMemo } from "react"

import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons"

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

export type MapsSortOrder = "asc" | "desc"
export type MapsSortField = keyof KZProfileMap
export interface MapsSortOption {
    value: MapsSortField
    label: string
}

interface MapsSortingProps {
    sortOrder: MapsSortOrder
    setSortOrder: Dispatch<SetStateAction<MapsSortOrder>>
    sortField: MapsSortField
    setSortField: Dispatch<SetStateAction<MapsSortField>>
}

export function MapsSorting({
    sortOrder,
    setSortOrder,
    sortField,
    setSortField,
}: MapsSortingProps) {
    const sortOptions = useMemo<MapsSortOption[]>(() => {
        return [
            { value: "created_on", label: "Release date" },
            { value: "name", label: "Name" },
            { value: "difficulty", label: "Tier" },
            { value: "bonus_count", label: "Bonus count" },
            { value: "filesize", label: "Filesize" },
        ]
    }, [])

    const sortFieldLabel = useMemo(() => {
        return sortOptions.find((sortOption) => sortOption.value === sortField)?.label
    }, [sortOptions, sortField])

    const onSortChange = (order: MapsSortOrder, field: MapsSortField) => {
        setSortOrder(order)
        setSortField(field)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-dashed">
                    {sortOrder === "asc" && <ArrowUpIcon className="mr-2 h-4 w-4" />}
                    {sortOrder === "desc" && <ArrowDownIcon className="mr-2 h-4 w-4" />}
                    {sortFieldLabel}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end">
                {sortOptions.map((sortOption) => {
                    return (
                        <DropdownMenuSub key={sortOption.value}>
                            <DropdownMenuSubTrigger>{sortOption.label}</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        onSelect={() => onSortChange("asc", sortOption.value)}
                                    >
                                        Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() => onSortChange("desc", sortOption.value)}
                                    >
                                        Descending
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
