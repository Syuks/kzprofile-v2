import { useQuery, QueryOptions } from "@tanstack/react-query"
import { GlobalAPI_GetServers } from "./APIs/GlobalAPI"

const useGlobalServers = (queryOptions: QueryOptions = {}) => {
    // Servers should be fetched once for the whole session
    return useQuery({
        queryKey: ["servers", "globalServers"],
        queryFn: async () => {
            const response = await GlobalAPI_GetServers({ approval_status: 1, limit: 9999 })
            const json = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
        ...queryOptions,
    })
}

export default useGlobalServers
