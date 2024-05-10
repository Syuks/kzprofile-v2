import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"

import { fetchKZProfileMaps } from "./useKZProfileMaps"

const KZProfileMapQueryOptions = (mapName: string) => {
    return queryOptions({
        queryKey: ["map", "kzProfileMap", mapName],
        queryFn: async () => {
            const response = await fetchKZProfileMaps()
            const map = response.find((map) => mapName === map.name)
            return map
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

const useKZProfileMap = (mapName: string) => {
    // Maps should be fetched once for the whole session
    return useQuery(KZProfileMapQueryOptions(mapName))
}

const fetchKZProfileMap = (mapName: string) => {
    return queryClient.fetchQuery(KZProfileMapQueryOptions(mapName))
}

export default useKZProfileMap
export { fetchKZProfileMap }
