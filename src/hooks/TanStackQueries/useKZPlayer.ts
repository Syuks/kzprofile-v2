import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetPlayers } from "./APIs/GlobalAPI"
import { getSteam64 } from "@/lib/steamid"

interface Player {
    steamid64: string
    steam_id: string
    is_banned: boolean
    total_records: number
    name: string
}

const KZPlayerQueryOptions = (steamidOrName: string) => {
    return queryOptions({
        queryKey: ["kz_player", steamidOrName],
        queryFn: async () => {
            const steamid64 = getSteam64(steamidOrName)
            if (!!steamid64) {
                const response = await GlobalAPI_GetPlayers({
                    steamid64_list: [steamid64],
                    limit: 1,
                })
                const json: Player[] = await response.json()
                return json[0]
            }

            const response = await GlobalAPI_GetPlayers({ name: steamidOrName, limit: 1 })
            const json: Player[] = await response.json()
            return json[0]
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

const useKZPlayer = (steamidOrName: string) => {
    return useQuery(KZPlayerQueryOptions(steamidOrName))
}

const fetchKZPlayer = (steamidOrName: string) => {
    return queryClient.fetchQuery(KZPlayerQueryOptions(steamidOrName))
}

export default useKZPlayer
export { fetchKZPlayer, type Player }
