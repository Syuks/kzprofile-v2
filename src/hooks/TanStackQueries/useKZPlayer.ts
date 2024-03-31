import { useQuery, QueryOptions } from "@tanstack/react-query"
import { GlobalAPI_GetPlayers } from "./APIs/GlobalAPI"

const useKZPlayer = (steamID: string, queryOptions: QueryOptions = {}) => {
    return useQuery({
        queryKey: ["kz_player", steamID],
        queryFn: async () => {
            const response = await GlobalAPI_GetPlayers({ steamid64_list: [steamID] })
            const json = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
        ...queryOptions,
    })
}

export default useKZPlayer
