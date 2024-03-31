import { useQuery } from "@tanstack/react-query"
import { GlobalAPI_GetServers } from "./APIs/GlobalAPI"

interface Server {
    id: number
    port: number
    ip: string
    name: string
    owner_steamid64: string
}

const useGlobalServers = () => {
    // Servers should be fetched once for the whole session
    return useQuery({
        queryKey: ["servers", "globalServers"],
        queryFn: async () => {
            const response = await GlobalAPI_GetServers({ approval_status: 1, limit: 9999 })
            const json: Server[] = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

export default useGlobalServers
