import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetServers } from "./APIs/GlobalAPI"
import type { GlobalServer } from "./useGlobalServerById"

const globalServersQueryOptions = () => {
    return queryOptions({
        queryKey: ["servers", "globalServers"],
        queryFn: async () => {
            const response = await GlobalAPI_GetServers({ approval_status: 1, limit: 9999 })
            const json: GlobalServer[] = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

const useGlobalServers = () => {
    // Servers should be fetched once for the whole session
    return useQuery(globalServersQueryOptions())
}

const fetchGlobalServers = () => {
    return queryClient.fetchQuery(globalServersQueryOptions())
}

export default useGlobalServers
export { fetchGlobalServers }
