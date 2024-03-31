import { useQuery } from "@tanstack/react-query"
import {
    GlobalAPI_GetRecordsTopWorldRecords,
    GetRecordsTopWorldRecordsParams,
} from "./APIs/GlobalAPI"

import { getGameModeID, GameMode, RunType } from "@/lib/gokz"

interface RecordsTopWorldRecord {
    steamid64: string
    steam_id: string
    count: number
    player_name: string
}

const useTopWorldRecords = (gameMode: GameMode, runType: RunType, stages: number) => {
    return useQuery({
        queryKey: ["topWorldRecords", gameMode, runType, stages],
        queryFn: async () => {
            const params: GetRecordsTopWorldRecordsParams = {
                mode_ids: [getGameModeID(gameMode)],
                stages: [0],
                tickrates: [128],
                limit: 20,
            }

            if (runType === "nub") {
                const response = await GlobalAPI_GetRecordsTopWorldRecords(params)
                const json: RecordsTopWorldRecord[] = await response.json()
                return json
            }

            const response = await GlobalAPI_GetRecordsTopWorldRecords({
                ...params,
                has_teleports: runType === "tp",
            })
            const json: RecordsTopWorldRecord[] = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

export default useTopWorldRecords
