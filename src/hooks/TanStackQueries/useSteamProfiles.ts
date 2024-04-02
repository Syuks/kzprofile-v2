import { useQuery } from "@tanstack/react-query"
import { SteamAPI_GetProfiles } from "./APIs/KZProfileAPI"

export interface SteamPlayerSummary {
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

const useSteamProfiles = (steamIds: string[]) => {
    return useQuery({
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

export default useSteamProfiles
