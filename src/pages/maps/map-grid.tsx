import { type Table } from "@tanstack/react-table"

import { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"

import MapCard, { LoadingMapCard } from "@/components/maps/map-card"

interface MapGridProps {
    table: Table<KZProfileMap>
    isLoading: boolean
}

function MapGrid({ table, isLoading }: MapGridProps) {
    // Loading state
    if (isLoading) {
        const placeHolderData = Array(table.getState().pagination.pageSize).fill({})

        return placeHolderData.map((_, index) => (
            <div key={index} className="min-w-[250px] max-w-[300px] flex-1 px-1 pb-16">
                <LoadingMapCard />
            </div>
        ))
    }

    const maps = table.getRowModel().rows

    // Empty table
    if (!maps.length) {
        return <div className="flex justify-center">No results.</div>
    }

    return maps.map((row) => (
        <div key={row.id} className="min-w-[250px] max-w-[300px] flex-1 px-1 pb-16">
            <MapCard kzProfileMap={row.original} />
        </div>
    ))
}

export default MapGrid
