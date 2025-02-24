import { useQuery, queryOptions, keepPreviousData } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetRecordsTopRecent, GetRecordsTopRecentParams } from "./APIs/GlobalAPI"

import { getGameModeName, type GameMode, type RunType } from "@/lib/gokz"

import { RecordsTopRecent } from "./useMapWRs"
import { SteamAPI_GetProfiles } from "./APIs/KZProfileAPI"
import { SteamPlayerSummary } from "./useSteamProfiles"
import { RecordsTopRecentWithSteamProfile } from "./useRecentTimes"

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
            if (!!mapName && getGameModeName(gameMode) === "kz_vanilla") {
                // There's a bug in the API where modes_list_string=kz_vanilla with map_name doesn't work.
                return []
            }

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
        enabled: !!mapName,
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
