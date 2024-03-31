import { useQuery, QueryOptions } from "@tanstack/react-query"
import { SteamAPI_GetProfiles } from "./APIs/KZProfileAPI"

const useSteamProfiles = (steamIds: string[], queryOptions: QueryOptions = {}) => {
    return useQuery({
        queryKey: ["steamProfiles", steamIds],
        queryFn: async () => {
            const response = await SteamAPI_GetProfiles(steamIds)
            const json = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
        ...queryOptions,
    })
}

export default useSteamProfiles
