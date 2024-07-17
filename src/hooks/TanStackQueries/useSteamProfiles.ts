import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { SteamAPI_GetProfiles } from "./APIs/KZProfileAPI"

interface SteamPlayerSummary {
    steamid: string
    personaname: string
    profileurl: string
    avatar: string
    avatarmedium: string
    avatarfull: string
    personastate: number
    realname: string
    primaryclanid: string
    timecreated: number
    personastateflags: number
    loccountrycode: string
    locstatecode: string
}

const steamProfilesQueryOptions = (steamIds: string[]) => {
    return queryOptions({
        queryKey: ["steamProfiles", steamIds],
        queryFn: async () => {
            const response = await SteamAPI_GetProfiles(steamIds)
            const json: SteamPlayerSummary[] = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

const useSteamProfiles = (steamIds: string[]) => {
    return useQuery(steamProfilesQueryOptions(steamIds))
}

const fetchSteamProfiles = (steamIds: string[]) => {
    return queryClient.fetchQuery(steamProfilesQueryOptions(steamIds))
}

export default useSteamProfiles
export { fetchSteamProfiles, type SteamPlayerSummary }
