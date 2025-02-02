import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { SteamAPI_ServersIp, SteamAPI_ServersMap } from "./APIs/KZProfileAPI"
import { type TierID } from "@/lib/gokz"
import { regEx_ServerIP } from "@/lib/regex-library"
import { fetchKZProfileMaps } from "./useKZProfileMaps"
import { fetchGlobalServers } from "./useGlobalServers"

interface SteamServer {
    addr: string
    appid: number
    bots: number
    dedicated: boolean
    gamedir: string
    gameport: number
    gametype: string
    map: string
    max_players: number
    name: string
    os: string
    players: number
    product: string
    region: number
    secure: boolean
    steamid: string
    version: string
}

type Plugin = "gokz" | "kz timer" | undefined

interface KzProfileServer extends SteamServer {
    global: boolean
    keywords: string
    difficulty: TierID | undefined
    plugin: Plugin
    ping: number
}

const steamServersQueryOptions = (query: string, enabled: boolean) => {
    return queryOptions({
        queryKey: ["steamServers", query],
        queryFn: async () => {
            const [globalServers, kzProfileMaps] = await Promise.all([
                fetchGlobalServers(),
                fetchKZProfileMaps(),
            ])

            const gokzTags = ["gokz"]
            const kztTags = ["kz timer", "kzt", "kztimer"]

            let steamServers: SteamServer[] = []

            // If the query string is a server IP
            if (regEx_ServerIP.test(query)) {
                const ipResponse = await SteamAPI_ServersIp(query)

                if (!ipResponse.ok) {
                    throw new Error("Steam API returned an error")
                }

                steamServers = await ipResponse.json()
            } else {
                // If the query string is a map name or any other value different than a server IP
                const workshopId =
                    kzProfileMaps.find((map) => map.name === query)?.workshop_id ?? ""

                const mapResponse = await SteamAPI_ServersMap(query, workshopId)

                if (!mapResponse.ok) {
                    throw new Error("Steam API returned an error")
                }

                steamServers = await mapResponse.json()
            }

            const kzProfileServers: KzProfileServer[] = steamServers.map((steamServer) => {
                const isGlobal = !!globalServers.find((globalServer) => {
                    return steamServer.addr === `${globalServer.ip}:${globalServer.port}`
                })

                const mapName = steamServer.map.split("/").pop()?.toLowerCase() ?? ""

                const difficulty = kzProfileMaps.find((map) => map.name === mapName)?.difficulty

                let plugin: Plugin = undefined
                const keywords = steamServer.name.toLowerCase() + steamServer.gametype.toLowerCase()

                if (gokzTags.some((el) => keywords.includes(el))) {
                    plugin = "gokz"
                } else if (kztTags.some((el) => keywords.includes(el))) {
                    plugin = "kz timer"
                }

                return {
                    ...steamServer,
                    map: mapName,
                    global: isGlobal,
                    keywords: steamServer.gametype,
                    difficulty: difficulty,
                    plugin: plugin,
                    ping: 20,
                }
            })

            return kzProfileServers
        },
        enabled,
    })
}

const useSteamServers = (query: string, enabled: boolean) => {
    return useQuery(steamServersQueryOptions(query, enabled))
}

const fetchSteamServers = (query: string, enabled: boolean) => {
    return queryClient.fetchQuery(steamServersQueryOptions(query, enabled))
}

export default useSteamServers
export { fetchSteamServers, type SteamServer, type KzProfileServer }
