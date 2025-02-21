import { useEffect, useMemo, useState } from "react"

import useKZProfileMaps, { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"
import {
    DatatableAddFiltersDropdown,
    type SelectedFilter,
} from "@/components/datatable/datatable-add-filters-dropdown"

import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    getFacetedUniqueValues,
    getFacetedRowModel,
    getFacetedMinMaxValues,
    Column,
} from "@tanstack/react-table"

import { GameModeID, type TierID } from "@/lib/gokz"
import { getFileSizeString } from "@/lib/utils"

import MapsSorting from "@/components/maps/maps-sorting"
import { DataTablePagination } from "@/components/datatable/datatable-pagination"
import { DataTableFacetedFilter } from "@/components/datatable/datatable-faceted-filter"
import {
    DataTableDateFilter,
    dateFilterFunction,
} from "@/components/datatable/datatable-date-filter"
import {
    DatatableFacetedMinMaxFilter,
    arrayLengthFilterFn,
} from "@/components/datatable/datatable-faceted-min-max-filter"

import { Input } from "@/components/ui/input"
import MapGrid from "./map-grid"

function Maps() {
    useEffect(() => {
        document.title = "Maps - KZ Profile"
    }, [])

    const kzProfileMapsQuery = useKZProfileMaps()

    const [globalFilter, setGlobalFilter] = useState("")
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: SelectedFilter }>({
        difficulty: { label: "Tier", show: false },
        created_on: { label: "Date", show: false },
        filters: { label: "Filters", show: false },
        bonus_count: { label: "Bonus count", show: false },
        videos: { label: "Videos", show: false },
        filesize: { label: "Filesize", show: false },
    })

    const tableData = useMemo(() => {
        if (!kzProfileMapsQuery.data) {
            return []
        }

        return kzProfileMapsQuery.data
    }, [kzProfileMapsQuery.data])

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<KZProfileMap>()

        return [
            columnHelper.accessor("id", {}),
            columnHelper.accessor("name", {}),
            columnHelper.accessor("filesize", {
                filterFn: "inNumberRange",
            }),
            columnHelper.accessor("difficulty", {
                filterFn: (row, id, value) => {
                    return value.includes(row.getValue<TierID>(id))
                },
            }),
            columnHelper.accessor("created_on", {
                filterFn: dateFilterFunction,
            }),
            columnHelper.accessor("workshop_id", {}),
            columnHelper.accessor("filters", {
                filterFn: (row, id, value: GameModeID[]) => {
                    const rowValues = row.getValue<GameModeID[]>(id)
                    return value.some((v) => rowValues.includes(v))
                },
            }),
            columnHelper.accessor("bonus_count", {
                filterFn: "inNumberRange",
            }),
            columnHelper.accessor("mapperNames", {}),
            columnHelper.accessor("mapperIds", {}),
            columnHelper.accessor("videos", {
                filterFn: arrayLengthFilterFn,
            }),
        ]
    }, [])

    // Only strings and numbers are passed to a custom FilterFn because of the original getColumnCanGlobalFilter function.
    // I want to be able to search mapper names and ids which are string arrays so I must replace the original function
    // See getColumnCanGlobalFilter at table/packages/table-core/src/features/GlobalFiltering.ts.
    const getColumnCanGlobalFilter = (column: Column<KZProfileMap>) => {
        if (
            column.id === "name" ||
            column.id === "workshop_id" ||
            column.id === "mapperNames" ||
            column.id === "mapperIds"
        ) {
            return true
        }
        return false
    }

    const table = useReactTable({
        data: tableData,
        columns,
        state: {
            globalFilter,
        },
        initialState: {
            sorting: [{ id: "created_on", desc: true }],
            pagination: { pageIndex: 0, pageSize: 20 },
        },
        onGlobalFilterChange: setGlobalFilter,
        getColumnCanGlobalFilter: getColumnCanGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
    })

    const handleSelectedFiltersChange = (filter: string, isChecked: boolean) => {
        setSelectedFilters((oldSelectedFilter) => {
            return {
                ...oldSelectedFilter,
                [filter]: {
                    ...oldSelectedFilter[filter],
                    show: isChecked,
                },
            }
        })
        table.getColumn(filter)?.setFilterValue(undefined)
    }

    return (
        <div className="py-10">
            <div className="flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Global maps
                </h2>
                <div className="flex space-x-2">
                    <DatatableAddFiltersDropdown
                        selectedFilters={selectedFilters}
                        onSelectedFiltersChange={handleSelectedFiltersChange}
                    />
                    <MapsSorting table={table} />
                </div>
            </div>

            <div className="mb-24">
                <div className="flex items-center py-4">
                    <div className="flex flex-wrap">
                        <div className="mr-4 mt-4 max-w-sm">
                            <Input
                                placeholder="Search..."
                                value={globalFilter}
                                type="search"
                                onChange={(event) => setGlobalFilter(event.target.value)}
                            />
                        </div>
                        {selectedFilters.difficulty.show && (
                            <div className="mr-4 mt-4">
                                <DataTableFacetedFilter
                                    options={[
                                        { label: "Very Easy", value: 1 },
                                        { label: "Easy", value: 2 },
                                        { label: "Medium", value: 3 },
                                        { label: "Hard", value: 4 },
                                        { label: "Very Hard", value: 5 },
                                        { label: "Extreme", value: 6 },
                                        { label: "Death", value: 7 },
                                    ]}
                                    title="Tier"
                                    column={table.getColumn("difficulty")}
                                />
                            </div>
                        )}
                        {selectedFilters.created_on.show && (
                            <div className="mr-4 mt-4">
                                <DataTableDateFilter
                                    column={table.getColumn("created_on")}
                                    title="Date"
                                />
                            </div>
                        )}
                        {selectedFilters.filters.show && (
                            <div className="mr-4 mt-4">
                                <DataTableFacetedFilter
                                    options={[
                                        { label: "KZ Timer", value: 200 },
                                        { label: "KZ Simple", value: 201 },
                                        { label: "KZ Vanilla", value: 202 },
                                    ]}
                                    title="Filters"
                                    column={table.getColumn("filters")}
                                />
                            </div>
                        )}
                        {selectedFilters.bonus_count.show && (
                            <div className="mr-4 mt-4">
                                <DatatableFacetedMinMaxFilter
                                    column={table.getColumn("bonus_count")}
                                    title="Bonus count"
                                />
                            </div>
                        )}
                        {selectedFilters.videos.show && (
                            <div className="mr-4 mt-4">
                                <DatatableFacetedMinMaxFilter
                                    column={table.getColumn("videos")}
                                    title="Videos"
                                    min={0}
                                    max={Infinity}
                                />
                            </div>
                        )}
                        {selectedFilters.filesize.show && (
                            <div className="mr-4 mt-4">
                                <DatatableFacetedMinMaxFilter
                                    column={table.getColumn("filesize")}
                                    title="Filesize"
                                    numberFormater={(value) =>
                                        value ? getFileSizeString(value) : "0.00 Bytes"
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap justify-center">
                    <MapGrid table={table} isLoading={kzProfileMapsQuery.isLoading} />
                </div>

                <DataTablePagination table={table} />
            </div>
        </div>
    )
}

export default Maps
