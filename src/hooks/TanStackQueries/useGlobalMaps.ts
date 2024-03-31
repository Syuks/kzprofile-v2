import { useQuery, QueryOptions } from "@tanstack/react-query"
import { GlobalAPI_GetMaps } from "./APIs/GlobalAPI"

const useGlobalMaps = (queryOptions: QueryOptions = {}) => {
    // Maps should be fetched once for the whole session
    return useQuery({
        queryKey: ["maps", "globalMaps"],
        queryFn: async () => {
            const response = await GlobalAPI_GetMaps({ is_validated: true, limit: 9999 })
            const json = await response.json()
            return json
        },
        staleTime: Infinity,
        gcTime: Infinity,
        ...queryOptions,
    })
}

export default useGlobalMaps
