import { useQuery } from "@tanstack/react-query"
import { GlobalAPI_GetRecordsTopWorldRecords } from "../../utils/APIs/GlobalAPI"
import { getGameModeID } from "../../utils/GOKZ"

const useTopWorldRecords = (gameMode, runType, stages, queryOptions = {}) => {
    return useQuery(
        ["topWorldRecords", gameMode, runType, stages],
        async () => {
            const params = {
                mode_ids: getGameModeID(gameMode),
                stages: 0,
                tickrates: 128,
                limit: 20
            }

            if (runType === "nub") {
                const { data } = await GlobalAPI_GetRecordsTopWorldRecords(params)
                return data
            }

            const { data } = await GlobalAPI_GetRecordsTopWorldRecords({...params, has_teleports: runType === "tp"})
            
            return data
        },
        {
            ...queryOptions,
            staleTime: Infinity,  // never refetch
            cacheTime: Infinity   // never delete cache
        }
    )
}

export default useTopWorldRecords