import { useMemo, useState } from "react"

import { PlusCircledIcon } from "@radix-ui/react-icons"

import useKZProfileMaps, { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"

import MapCard from "@/components/maps/map-card"
import MapsPagination from "@/components/maps/maps-pagination"
import MapsSorting, {
    type MapsSortOrder,
    type MapsSortField,
    sortMaps,
} from "@/components/maps/maps-sorting"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function Maps() {
    const kzProfileMapsQuery = useKZProfileMaps()

    const [globalFilter, setGlobalFilter] = useState<string>("")
    /*const [selectedFilters, setSelectedFilters] = useState({
        filesize: { label: "File size", show: false },
        difficulty: { label: "Tier", show: false },
        created_on: { label: "Date", show: false },
        filters: { label: "Filter", show: false },
        bonus_count: { label: "Bonus count", show: false },
        videos: { label: "Has Video", show: false },
    })*/
    const [sortOrder, setSortOrder] = useState<MapsSortOrder>("desc")
    const [sortField, setSortField] = useState<MapsSortField>("created_on")

    const [pageSize, setPageSize] = useState<number>(20)
    const [pageIndex, setPageIndex] = useState<number>(1)

    const filteredData = useMemo<KZProfileMap[]>(() => {
        if (!kzProfileMapsQuery.data) {
            return []
        }

        const cleanGlobalFilter = globalFilter.trim().toLowerCase()

        if (cleanGlobalFilter === "") {
            return sortMaps(kzProfileMapsQuery.data, sortField, sortOrder)
        }

        const globalFilterFields: (keyof KZProfileMap)[] = [
            "name",
            "mapperNames",
            "workshop_id",
            "mapperIds",
            "id",
        ]

        const filteredMaps = kzProfileMapsQuery.data.filter((map) => {
            let globalMatch = false

            for (let field of globalFilterFields) {
                if (map[field].toString().toLowerCase().indexOf(cleanGlobalFilter) !== -1) {
                    globalMatch = true
                    break
                }
            }

            return globalMatch
        })

        return sortMaps(filteredMaps, sortField, sortOrder)
    }, [kzProfileMapsQuery.data, globalFilter, sortOrder, sortField])

    const pageCount = useMemo<number>(
        () => Math.ceil(filteredData.length / pageSize),
        [pageSize, filteredData],
    )

    const paginatedData = useMemo<KZProfileMap[]>(() => {
        const startIndex = (pageIndex - 1) * pageSize

        return filteredData.slice(startIndex, startIndex + pageSize)
    }, [filteredData, pageIndex, pageSize])

    return (
        <div className="py-10">
            <div className="flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Global maps
                </h2>
                <div className="flex space-x-2">
                    <MapsSorting
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        sortField={sortField}
                        setSortField={setSortField}
                    />
                    <Button variant="outline" className="border-dashed">
                        <PlusCircledIcon className="mr-2 h-4 w-4" />
                        Add filter
                    </Button>
                </div>
            </div>

            <div className="mb-52">
                <div className="flex items-center py-4">
                    <div className="flex flex-wrap">
                        <div className="mr-4 mt-4 max-w-sm">
                            <Input
                                placeholder="Search map..."
                                value={globalFilter}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap">
                    {paginatedData.map((map) => {
                        return (
                            <div
                                key={map.id}
                                className="min-w-[250px] max-w-[300px] flex-1 px-1 pb-16"
                            >
                                <MapCard kzProfileMap={map} />
                            </div>
                        )
                    })}
                </div>

                <MapsPagination
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    pageCount={pageCount}
                    tablePageSizes={[20, 30, 40, 50]}
                />
            </div>
        </div>
    )
}

export default Maps
