import { useQuery, QueryOptions } from "@tanstack/react-query"
import { GlobalAPI_GetRecordFilters } from "./APIs/GlobalAPI"

import { getGameModeID, GameMode } from "@/lib/gokz"

const useGlobalFilters = (gameMode: GameMode, queryOptions: QueryOptions = {}) => {
    // Filters should be fetched once for the whole session
    return useQuery({
        queryKey: ["filters", gameMode],
        queryFn: async () => {
            const response = await GlobalAPI_GetRecordFilters({
                //stages: 0,
                mode_ids: [getGameModeID(gameMode)],
                tickrates: [128],
                has_teleports: false,
                limit: 9999,
            })
            const json = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
        ...queryOptions,
    })
}

export default useGlobalFilters
