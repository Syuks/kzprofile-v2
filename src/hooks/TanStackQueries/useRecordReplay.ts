import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetReplayByReplayId } from "./APIs/GlobalAPI"

const recordReplayOptions = (replayID: number) => {
    return queryOptions({
        queryKey: ["recordReplay", replayID],
        queryFn: async () => {
            const response = await GlobalAPI_GetReplayByReplayId(replayID)
            const blob = await response.blob()
            return blob
        },
        staleTime: Infinity, // never refetch
        gcTime: Infinity, // never delete cache
    })
}

const useRecordReplay = (replayID: number) => {
    return useQuery(recordReplayOptions(replayID))
}

const fetchRecordReplay = (replayID: number) => {
    return queryClient.fetchQuery(recordReplayOptions(replayID))
}

export default useRecordReplay
export { fetchRecordReplay }
