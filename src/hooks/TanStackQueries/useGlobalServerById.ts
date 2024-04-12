import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetServerById } from "./APIs/GlobalAPI"

export interface GlobalServer {
    id: number
    port: number
    ip: string
    name: string
    owner_steamid64: string
}

const globalServerByIdQueryOptions = (id: number) => {
    return queryOptions({
        queryKey: ["servers", "globalServers"],
        queryFn: async () => {
            const response = await GlobalAPI_GetServerById(id)
            const json: GlobalServer = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

const useGlobalServerById = (id: number) => {
    return useQuery(globalServerByIdQueryOptions(id))
}

const fetchGlobalServerById = (id: number) => {
    return queryClient.fetchQuery(globalServerByIdQueryOptions(id))
}

export default useGlobalServerById
export { fetchGlobalServerById }
