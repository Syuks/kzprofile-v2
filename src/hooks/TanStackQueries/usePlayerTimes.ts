import { useQuery } from "@tanstack/react-query"
import { GlobalAPI_GetRecordsTop, GetRecordsTopParams } from "./APIs/GlobalAPI"

import { getGameModeName, GameMode } from "@/lib/gokz"

export interface RecordsTop {
    id: number
    steamid64: string
    player_name: string
    steam_id: string
    server_id: number
    map_id: number
    stage: number
    mode: string
    tickrate: number
    time: number
    teleports: number
    created_on: string
    updated_on: string
    updated_by: number
    record_filter_id: number
    server_name: string
    map_name: string
    points: number
    replay_id: number
}

const usePlayerTimes = (steamID: string, gameMode: GameMode) => {
    return useQuery({
        queryKey: ["playerTimes", steamID, gameMode],
        queryFn: async () => {
            const baseParams: GetRecordsTopParams = {
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

            const proJson: RecordsTop[] = await proResponse.json()
            const tpJson: RecordsTop[] = await tpResponse.json()

            return {
                pro: proJson,
                tp: tpJson,
            }
        },
    })
}

export default usePlayerTimes
