import { Dispatch, SetStateAction, useMemo } from "react"

import { ArrowDownIcon, ArrowUpIcon, CircleIcon, RadiobuttonIcon } from "@radix-ui/react-icons"

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

const sortOptions: MapsSortOption[] = [
    { value: "created_on", label: "Release date" },
    { value: "name", label: "Name" },
    { value: "difficulty", label: "Tier" },
    { value: "bonus_count", label: "Bonus count" },
    { value: "filesize", label: "Filesize" },
    { value: "id", label: "Id" },
]

export const sortMaps = (
    maps: KZProfileMap[],
    sortField: MapsSortField,
    sortOrder: MapsSortOrder,
): KZProfileMap[] => {
    let preOrderSort = [...maps]

    if (sortField === "created_on") {
        preOrderSort.sort(
            (mapA, mapB) =>
                new Date(mapB.created_on).getTime() - new Date(mapA.created_on).getTime(),
        )
    }

    if (sortField === "name") {
        preOrderSort.sort((mapA, mapB) => {
            const nameA = mapA.name.toLowerCase()
            const nameB = mapB.name.toLowerCase()
            if (nameA < nameB) {
                return -1
            }

            if (nameA > nameB) {
                return 1
            }

            return 0
        })
    }

    if (
        sortField === "difficulty" ||
        sortField === "bonus_count" ||
        sortField === "filesize" ||
        sortField === "id"
    ) {
        preOrderSort.sort((mapA, mapB) => mapB[sortField] - mapA[sortField])
    }

    return sortOrder === "desc" ? preOrderSort : preOrderSort.reverse()
}

export function MapsSorting({
    sortOrder,
    setSortOrder,
    sortField,
    setSortField,
}: MapsSortingProps) {
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
                            <DropdownMenuSubTrigger>
                                {sortOption.value === sortField ? (
                                    <RadiobuttonIcon className="mr-2 h-4 w-4" />
                                ) : (
                                    <CircleIcon className="mr-2 h-4 w-4" />
                                )}
                                {sortOption.label}
                            </DropdownMenuSubTrigger>

                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        onSelect={() => onSortChange("desc", sortOption.value)}
                                    >
                                        {sortOption.value === sortField && sortOrder === "desc" ? (
                                            <RadiobuttonIcon className="mr-2 h-4 w-4" />
                                        ) : (
                                            <CircleIcon className="mr-2 h-4 w-4" />
                                        )}
                                        Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() => onSortChange("asc", sortOption.value)}
                                    >
                                        {sortOption.value === sortField && sortOrder === "asc" ? (
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
