import { useQuery } from "@tanstack/react-query"
import { GlobalAPI_GetPlayers } from "./APIs/GlobalAPI"

interface Player {
    steamid64: string
    steam_id: string
    is_banned: boolean
    total_records: number
    name: string
}

const useKZPlayer = (steamID: string) => {
    return useQuery({
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

export default useKZPlayer
