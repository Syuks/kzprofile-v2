import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetPlayers } from "./APIs/GlobalAPI"

interface Player {
    steamid64: string
    steam_id: string
    is_banned: boolean
    total_records: number
    name: string
}

const KZPlayersInfiniteQueryOptions = (name: string, pageSize: number, enabled: boolean) => {
    return infiniteQueryOptions({
        queryKey: ["kz_players", name],
        queryFn: async ({ pageParam }) => {
            const response = await GlobalAPI_GetPlayers({
                name: name,
                limit: pageSize,
                offset: pageParam,
            })
            const json: Player[] = await response.json()
            return json
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
export { fetchKZPlayers }
