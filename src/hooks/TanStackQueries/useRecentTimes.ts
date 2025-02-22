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
    limit: number,
    createdSince?: string,
    place_top_at_least?: number,
) => {
    return queryOptions({
        queryKey: [
            "recentTimes",
            gameMode,
            runType,
            stage,
            limit,
            createdSince,
            place_top_at_least,
        ],
        queryFn: async () => {
            let params: GetRecordsTopRecentParams = {
                modes_list_string: getGameModeName(gameMode),
                stage: stage,
                tickrate: 128,
                limit: limit,
            }

            if (!!createdSince) {
                params.created_since = createdSince
            }

            if (!!place_top_at_least) {
                params.place_top_at_least = place_top_at_least
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
                (record) => {
                    const steamProfile = steamJson.find(
                        (steamProfile) => steamProfile.steamid === record.steamid64,
                    ) as SteamPlayerSummary

                    return {
                        ...record,
                        steamProfile,
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
    limit: number,
    createdSince?: string,
    place_top_at_least?: number,
) => {
    return useQuery(
        recentTimesQueryOptions(gameMode, runType, stage, limit, createdSince, place_top_at_least),
    )
}

const fetchRecentTimes = (
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    limit: number,
    createdSince?: string,
    place_top_at_least?: number,
) => {
    return queryClient.fetchQuery(
        recentTimesQueryOptions(gameMode, runType, stage, limit, createdSince, place_top_at_least),
    )
}

export default useRecentTimes
export { fetchRecentTimes }
