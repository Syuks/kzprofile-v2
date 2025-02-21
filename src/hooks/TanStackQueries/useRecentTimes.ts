import { useQuery, queryOptions, keepPreviousData } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetRecordsTopRecent, GetRecordsTopRecentParams } from "./APIs/GlobalAPI"
import { SteamAPI_GetProfiles } from "./APIs/KZProfileAPI"

import { getGameModeName, type GameMode, type RunType } from "@/lib/gokz"

import { type RecordsTopRecent } from "./useMapWRs"
import { type SteamPlayerSummary } from "./useSteamProfiles"

export interface RecordsTopRecentWithSteamProfile extends RecordsTopRecent {
    steamProfile: SteamPlayerSummary
}

const recentTimesQueryOptions = (
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
    createdSince: string,
) => {
    return queryOptions({
        queryKey: ["recentTimes", gameMode, runType, stage, pageSize, createdSince],
        queryFn: async () => {
            let params: GetRecordsTopRecentParams = {
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

            const apiResponse = await GlobalAPI_GetRecordsTopRecent(params)
            const apiJson: RecordsTopRecent[] = await apiResponse.json()

            const steamIds = apiJson.map((record) => record.steamid64)
            const steamResponse = await SteamAPI_GetProfiles(steamIds)
            const steamJson: SteamPlayerSummary[] = await steamResponse.json()

            const recentTimesWithSteamProfile: RecordsTopRecentWithSteamProfile[] = apiJson.map(
                (record, index) => {
                    return {
                        ...record,
                        steamProfile: steamJson[index],
                    }
                },
            )

            return recentTimesWithSteamProfile
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
        placeholderData: keepPreviousData, // App hangs without this. I think it's related to how I use tanstack table. Should be fixable.
    })
}

const useRecentTimes = (
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
    createdSince: string,
) => {
    return useQuery(recentTimesQueryOptions(gameMode, runType, stage, pageSize, createdSince))
}

const fetchRecentTimes = (
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
    createdSince: string,
) => {
    return queryClient.fetchQuery(
        recentTimesQueryOptions(gameMode, runType, stage, pageSize, createdSince),
    )
}

export default useRecentTimes
export { fetchRecentTimes }
