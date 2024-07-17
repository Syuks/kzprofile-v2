import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query"
import { queryClient } from "@/main"

import type { Player } from "./useKZPlayer"
import { GlobalAPI_GetPlayers } from "./APIs/GlobalAPI"

import { type SteamPlayerSummary } from "./useSteamProfiles"
import { SteamAPI_GetProfiles } from "./APIs/KZProfileAPI"

interface KZPlayerExtended extends Player, SteamPlayerSummary {}

const KZPlayersInfiniteQueryOptions = (name: string, pageSize: number, enabled: boolean) => {
    return infiniteQueryOptions({
        queryKey: ["kz_players", name, pageSize],
        queryFn: async ({ pageParam }) => {
            const globalAPIResponse = await GlobalAPI_GetPlayers({
                name: name,
                offset: pageParam,
                limit: pageSize,
            })
            const globalAPIJson: Player[] = await globalAPIResponse.json()

            if (!globalAPIJson.length) {
                return []
            }

            const steamProfilesResponse = await SteamAPI_GetProfiles(
                globalAPIJson.map((player) => player.steamid64),
            )
            const steamProfilesJson: SteamPlayerSummary[] = await steamProfilesResponse.json()

            const kzPlayerExtened: KZPlayerExtended[] = steamProfilesJson.map((steamProfile) => {
                const globalAPIPlayer = globalAPIJson.find(
                    (player) => player.steamid64 === steamProfile.steamid,
                ) as Player // We know it exists

                return {
                    ...steamProfile,
                    ...globalAPIPlayer,
                }
            })

            return kzPlayerExtened
        },
        initialPageParam: 0,
        getNextPageParam: (lastPageData, allPagesData) =>
            lastPageData.length === pageSize ? pageSize * allPagesData.length : undefined,
        enabled,
    })
}

const useKZPlayers = (name: string, pageSize: number, enabled: boolean) => {
    return useInfiniteQuery(KZPlayersInfiniteQueryOptions(name, pageSize, enabled))
}

const fetchKZPlayers = (name: string, pageSize: number, enabled: boolean) => {
    return queryClient.fetchQuery(KZPlayersInfiniteQueryOptions(name, pageSize, enabled))
}

export default useKZPlayers
export { fetchKZPlayers, type KZPlayerExtended }
