import { useQuery, queryOptions, keepPreviousData } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetRecordsTopRecent, GetRecordsTopRecentParams } from "./APIs/GlobalAPI"

import { getGameModeID, getGameModeName, type GameMode, type RunType } from "@/lib/gokz"

import { RecordsTopRecent } from "./useMapWRs"
import { SteamAPI_GetProfiles } from "./APIs/KZProfileAPI"
import { SteamPlayerSummary } from "./useSteamProfiles"
import { RecordsTopRecentWithSteamProfile } from "./useRecentTimes"
import { KZProfileMap } from "./useKZProfileMaps"

const mapRecentTimesQueryOptions = (
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
    createdSince: string,
    map?: KZProfileMap,
) => {
    return queryOptions({
        queryKey: ["mapRecentTimes", map?.name, gameMode, runType, stage, pageSize, createdSince],
        queryFn: async () => {
            if (!map?.filters.includes(getGameModeID(gameMode))) {
                // There's a bug in the API. If the map doesn't have a filter for the game mode, it returns every map.
                return []
            }

            let params: GetRecordsTopRecentParams = {
                map_name: map.name,
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
        enabled: !!map,
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
        placeholderData: keepPreviousData, // App hangs without this. I think it's related to how I use tanstack table. Should be fixable.
    })
}

const useMapRecentTimes = (
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
    createdSince: string,
    map?: KZProfileMap,
) => {
    return useQuery(
        mapRecentTimesQueryOptions(gameMode, runType, stage, pageSize, createdSince, map),
    )
}

const fetchMapRecentTimes = (
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
    createdSince: string,
    map?: KZProfileMap,
) => {
    return queryClient.fetchQuery(
        mapRecentTimesQueryOptions(gameMode, runType, stage, pageSize, createdSince, map),
    )
}

export default useMapRecentTimes
export { fetchMapRecentTimes }
