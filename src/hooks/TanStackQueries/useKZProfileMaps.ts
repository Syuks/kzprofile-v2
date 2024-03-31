import { useQuery } from "@tanstack/react-query"
import { KZProfileAPI_GetMaps } from "./APIs/KZProfileAPI"

interface KZProfileMap {
    id: number
    mappers: { name: string; steamid: string }[]
    videos: string[]
}

const useKZProfileMaps = () => {
    // Maps should be fetched once for the whole session
    return useQuery({
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

export default useKZProfileMaps
