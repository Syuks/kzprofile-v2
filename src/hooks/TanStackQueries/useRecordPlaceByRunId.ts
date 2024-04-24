import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetRecordPlaceById } from "./APIs/GlobalAPI"

const recordPlaceByRunIdOptions = (runID: number) => {
    return queryOptions({
        queryKey: ["recordPlaceByRunId", runID],
        queryFn: async () => {
            const response = await GlobalAPI_GetRecordPlaceById(runID)
            const json: string = await response.json()
            return json
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

const useRecordPlaceByRunId = (runID: number) => {
    return useQuery(recordPlaceByRunIdOptions(runID))
}

const fetchRecordPlaceByRunId = (runID: number) => {
    return queryClient.fetchQuery(recordPlaceByRunIdOptions(runID))
}

export default useRecordPlaceByRunId
export { fetchRecordPlaceByRunId }
