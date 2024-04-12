import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetRecordFilters } from "./APIs/GlobalAPI"

import { getGameModeID, GameMode } from "@/lib/gokz"

interface RecordFilter {
    id: number
    map_id: number
    stage: number
    mode_id: number
    tickrate: number
    has_teleports: boolean
    created_on: string
    updated_on: string
    updated_by_id: string
}

const globalFiltersQueryOptions = (gameMode: GameMode) => {
    return queryOptions({
        queryKey: ["filters", gameMode],
        queryFn: async () => {
            const response = await GlobalAPI_GetRecordFilters({
                //stages: 0,
                mode_ids: [getGameModeID(gameMode)],
                tickrates: [128],
                has_teleports: false,
                limit: 9999,
            })
            const json: RecordFilter[] = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

const useGlobalFilters = (gameMode: GameMode) => {
    // Filters should be fetched once for the whole session
    return useQuery(globalFiltersQueryOptions(gameMode))
}

const fetchGlobalFilters = (gameMode: GameMode) => {
    return queryClient.fetchQuery(globalFiltersQueryOptions(gameMode))
}

export default useGlobalFilters
export { fetchGlobalFilters }
