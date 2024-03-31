import { useQuery } from "@tanstack/react-query"
import { SteamAPI_GetProfiles } from "../../utils/APIs/KZProfileAPI"

/**
 * React Query of Steam Profiles
 * 
 * @param {Array} steamIds Array of steam ids to fetch
 */
const useSteamProfiles = (steamIds, queryOptions = {}) => {
    return useQuery(
        ["steamProfiles", steamIds],
        async () => {
            const { data } = await SteamAPI_GetProfiles({steamids: steamIds})
            return data.response.players
        },
        {
            ...queryOptions,
            staleTime: Infinity,  // never refetch
            cacheTime: Infinity   // never delete cache
        }
    )
}

export default useSteamProfiles