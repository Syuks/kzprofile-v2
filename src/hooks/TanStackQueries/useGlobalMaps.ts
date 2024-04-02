import { useQuery } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetMaps } from "./APIs/GlobalAPI"
import { TierID } from "@/lib/gokz"

interface Map {
    id: number
    name: string
    filesize: number
    validated: true
    difficulty: TierID
    created_on: string
    updated_on: string
    approved_by_steamid64: string
    workshop_url: string
    download_url: string
}

const globalMapsQueryOptions = {
    queryKey: ["maps", "globalMaps"],
    queryFn: async () => {
        const response = await GlobalAPI_GetMaps({ is_validated: true, limit: 9999 })
        const json: Map[] = await response.json()
        return json
    },
    staleTime: Infinity,
    gcTime: Infinity,
}

const useGlobalMaps = () => {
    return useQuery(globalMapsQueryOptions)
}

const fetchGlobalMaps = () => {
    return queryClient.fetchQuery(globalMapsQueryOptions)
}

export default useGlobalMaps
export { fetchGlobalMaps }
