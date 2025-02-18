import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetBans } from "./APIs/GlobalAPI"

interface Ban {
    id: number
    ban_type: string
    expires_on: string
    ip: string
    steamid64: number
    player_name: string
    steam_id: string
    notes: string
    stats: string
    server_id: number
    updated_by_id: number
    created_on: string
    updated_on: string
}

const GlobalBansInfiniteQueryOptions = (steamid64: string, pageSize: number) => {
    return infiniteQueryOptions({
        queryKey: ["global_bans", steamid64, pageSize],
        queryFn: async ({ pageParam }) => {
            const response = await GlobalAPI_GetBans({
                steamid64: steamid64,
                limit: pageSize,
                offset: pageParam,
            })
            const json: Ban[] = await response.json()
            return json
        },
        initialPageParam: 0,
        getNextPageParam: (lastPageData, allPagesData) =>
            lastPageData.length === pageSize ? pageSize * allPagesData.length : undefined,
    })
}

const useGlobalBans = (steamid64: string, pageSize: number) => {
    return useInfiniteQuery(GlobalBansInfiniteQueryOptions(steamid64, pageSize))
}

const fetchGlobalBans = (steamid64: string, pageSize: number) => {
    return queryClient.fetchInfiniteQuery(GlobalBansInfiniteQueryOptions(steamid64, pageSize))
}

export default useGlobalBans
export { fetchGlobalBans, type Ban }
