import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { KZProfileAPI_GetMaps } from "./APIs/KZProfileAPI"

interface KZProfileMap {
    id: number
    mappers: { name: string; steamid: string }[]
    videos: string[]
}

const KZProfileMapsQueryOptions = () => {
    return queryOptions({
        queryKey: ["maps", "kzProfileMaps"],
        queryFn: async () => {
            const response = await KZProfileAPI_GetMaps()
            const json: KZProfileMap[] = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

const useKZProfileMaps = () => {
    // Maps should be fetched once for the whole session
    return useQuery(KZProfileMapsQueryOptions())
}

const fetchKZProfileMaps = () => {
    return queryClient.fetchQuery(KZProfileMapsQueryOptions())
}

export default useKZProfileMaps
export { fetchKZProfileMaps }
