import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetRecordsTopRecent, GetRecordsTopRecentParams } from "./APIs/GlobalAPI"

import { getGameModeName, GameMode } from "@/lib/gokz"

interface RecordsTopRecent {
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

const mapWRsQueryOptions = (mapName: string, gameMode: GameMode, stage: number) => {
    return queryOptions({
        queryKey: ["mapWRs", mapName, gameMode, stage],
        queryFn: async () => {
            const baseParams: GetRecordsTopRecentParams = {
                map_name: mapName,
                modes_list_string: getGameModeName(gameMode),
                stage: stage,
                place_top_at_least: 1,
                tickrate: 128,
                limit: 100,
            }

            const response = await GlobalAPI_GetRecordsTopRecent(baseParams)
            const json: RecordsTopRecent[] = await response.json()

            // API BUG: If there're no records in the map with the given gameMode, the endpoint returns all the gameMode's recent times.
            // So we must check if the fist record's map is the same as the one we want. If not, return an empty array.
            // Limit is set to 100 so we don't get a ton of useless data when bugged. If there're more pro and tp wrs, the really old ones will not appear.

            if (!json.length || json[0].map_name !== mapName) {
                return {
                    pro: [],
                    tp: [],
                    nub: [],
                }
            }

            const proRecords = json.filter((record) => record.teleports === 0)

            const tpRecords = json.filter((record) => record.teleports !== 0)

            // Data already comes sorted by date, we reverse it to extract the nub times in order and reverse it again during the reduce callback.
            const reversedResponse = json.reverse()
            const nubRecords = reversedResponse.reduce(
                (prev, curr) => {
                    if (curr.time < prev[0].time) {
                        return [curr, ...prev]
                    }
                    return prev
                },
                [reversedResponse[0]],
            )

            return {
                pro: proRecords,
                tp: tpRecords,
                nub: nubRecords,
            }
        },
    })
}

const useMapWRs = (mapName: string, gameMode: GameMode, stage: number) => {
    return useQuery(mapWRsQueryOptions(mapName, gameMode, stage))
}

const fetchMapWRs = (mapName: string, gameMode: GameMode, stage: number) => {
    return queryClient.fetchQuery(mapWRsQueryOptions(mapName, gameMode, stage))
}

export default useMapWRs
export { fetchMapWRs, type RecordsTopRecent }
