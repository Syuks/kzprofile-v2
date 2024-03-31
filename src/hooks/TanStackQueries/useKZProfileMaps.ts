import { useQuery, QueryOptions } from "@tanstack/react-query"
import { KZProfileAPI_GetMaps } from "./APIs/KZProfileAPI"

const useKZProfileMaps = (queryOptions: QueryOptions = {}) => {
    // Maps should be fetched once for the whole session
    return useQuery({
        queryKey: ["maps", "kzProfileMaps"],
        queryFn: async () => {
            const response = await KZProfileAPI_GetMaps()
            const json = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
        ...queryOptions,
    })
}

export default useKZProfileMaps
