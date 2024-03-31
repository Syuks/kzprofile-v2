import { useQuery, QueryOptions } from "@tanstack/react-query"
import { GlobalAPI_GetRecordsTop } from "./APIs/GlobalAPI"

import { getGameModeName, GameMode } from "@/lib/gokz"

const usePlayerTimes = (steamID: string, gameMode: GameMode, queryOptions: QueryOptions = {}) => {
    return useQuery({
        queryKey: ["playerTimes", steamID, gameMode],
        queryFn: async () => {
            const baseParams = {
                steamid64: steamID,
                modes_list_string: getGameModeName(gameMode),
                stage: 0,
                tickrate: 128,
                limit: 9999,
            }

            const [proResponse, tpResponse] = await Promise.all([
                GlobalAPI_GetRecordsTop({ ...baseParams, has_teleports: false }),
                GlobalAPI_GetRecordsTop({ ...baseParams, has_teleports: true }),
            ])

            const proJson = await proResponse.json()
            const tpJson = await tpResponse.json()

            return {
                pro: proJson,
                tp: tpJson,
            }
        },
        ...queryOptions,
    })
}

export default usePlayerTimes
