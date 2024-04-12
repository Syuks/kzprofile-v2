import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetPlayers } from "./APIs/GlobalAPI"

interface Player {
    steamid64: string
    steam_id: string
    is_banned: boolean
    total_records: number
    name: string
}

const KZPlayerQueryOptions = (steamID: string) => {
    return queryOptions({
        queryKey: ["kz_player", steamID],
        queryFn: async () => {
            const response = await GlobalAPI_GetPlayers({ steamid64_list: [steamID] })
            const json: Player[] = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

const useKZPlayer = (steamID: string) => {
    return useQuery(KZPlayerQueryOptions(steamID))
}

const fetchKZPlayer = (steamID: string) => {
    return queryClient.fetchQuery(KZPlayerQueryOptions(steamID))
}

export default useKZPlayer
export { fetchKZPlayer }
