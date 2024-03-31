import { useQuery } from "@tanstack/react-query"
import { GlobalAPI_GetMaps } from "./APIs/GlobalAPI"

interface Map {
    id: number
    name: string
    filesize: number
    validated: true
    difficulty: number
    created_on: string
    updated_on: string
    approved_by_steamid64: string
    workshop_url: string
    download_url: string
}

const useGlobalMaps = () => {
    // Maps should be fetched once for the whole session
    return useQuery({
        queryKey: ["maps", "globalMaps"],
        queryFn: async () => {
            const response = await GlobalAPI_GetMaps({ is_validated: true, limit: 9999 })
            const json: Map[] = await response.json()
            return json
        },
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export default useGlobalMaps
