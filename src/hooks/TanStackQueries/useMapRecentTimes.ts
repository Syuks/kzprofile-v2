import { useQuery, queryOptions, keepPreviousData } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetRecordsTopRecent, GetRecordsTopRecentParams } from "./APIs/GlobalAPI"

import { getGameModeName, type GameMode, type RunType } from "@/lib/gokz"

export interface RecordsTopRecent {
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
    place: number
    top_100: number
    top_100_overall: number
    server_name: string
    map_name: string
    points: number
    record_filter_id: number
    replay_id: number
}

const mapRecentTimesQueryOptions = (
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
    createdSince: string,
    mapName?: string,
) => {
    return queryOptions({
        queryKey: ["mapRecentTimes", mapName, gameMode, runType, stage, pageSize, createdSince],
        queryFn: async () => {
            let params: GetRecordsTopRecentParams = {
                map_name: mapName,
                modes_list_string: getGameModeName(gameMode),
                stage: stage,
                tickrate: 128,
                limit: pageSize,
                created_since: createdSince,
            }

            if (runType === "pro") {
                params.has_teleports = false
            }

            if (runType === "tp") {
                params.has_teleports = true
            }

            if (runType === "nub") {
                params.has_teleports = undefined
            }

            const response = await GlobalAPI_GetRecordsTopRecent(params)
            const json: RecordsTopRecent[] = await response.json()
            return json
        },
        enabled: !!mapName,
        gcTime: 0,
        placeholderData: keepPreviousData, // App hangs without this. I think it's related to how I use tanstack table. Should be fixable.
    })
}

const useMapRecentTimes = (
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
    createdSince: string,
    mapName?: string,
) => {
    return useQuery(
        mapRecentTimesQueryOptions(gameMode, runType, stage, pageSize, createdSince, mapName),
    )
}

const fetchMapRecentTimes = (
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
    createdSince: string,
    mapName?: string,
) => {
    return queryClient.fetchQuery(
        mapRecentTimesQueryOptions(gameMode, runType, stage, pageSize, createdSince, mapName),
    )
}

export default useMapRecentTimes
export { fetchMapRecentTimes }
