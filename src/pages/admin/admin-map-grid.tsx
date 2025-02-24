import { type Table } from "@tanstack/react-table"

import { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"

import AdminMapCard, { LoadingAdminMapCard } from "./admin-map-card"

interface AdminMapGridProps {
    table: Table<KZProfileMap>
    isLoading: boolean
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    setDialogMap: React.Dispatch<React.SetStateAction<KZProfileMap | undefined>>
}

function AdminMapGrid({ table, isLoading, setOpenDialog, setDialogMap }: AdminMapGridProps) {
    // Loading state
    if (isLoading) {
        const placeHolderData = Array(table.getState().pagination.pageSize).fill({})

        return placeHolderData.map((_, index) => (
            <div key={index} className="min-w-[250px] max-w-[300px] flex-1 px-1 pb-16">
                <LoadingAdminMapCard />
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
            <AdminMapCard
                kzProfileMap={row.original}
                setOpenDialog={setOpenDialog}
                setDialogMap={setDialogMap}
            />
        </div>
    ))
}

export default AdminMapGrid
