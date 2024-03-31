import { useQuery } from "@tanstack/react-query"
import { GlobalAPI_GetRecordsTopRecent } from "../../utils/APIs/GlobalAPI"

const useMapWRs = (mapName, gameMode, stage, queryOptions = {}) => {
    return useQuery(
        ["mapWRs", mapName, gameMode, stage],
        async () => {
            const baseParams = {
                map_name: mapName,
                modes_list_string: gameMode,
                stage: stage,
                place_top_at_least: 1,
                tickrate: 128,
                limit: 100
            }

            const response = await GlobalAPI_GetRecordsTopRecent(baseParams)

            // API BUG: If there're no records in the map with the given gameMode, the endpoint returns all the gameMode's recent times.
            // So we must check if the fist record's map is the same as the one we want. If not, return an empty array.
            // Limit is set to 100 so we don't get a ton of useless data when bugged. If there're more pro and tp wrs, the really old ones will not appear.

            if (!response.data.length || response.data[0].map_name !== mapName) {
                return {
                    pro: [],
                    tp: [],
                    nub: []
                }
            }
            
            const proRecords = response.data.filter(record => record.teleports === 0)

            const tpRecords = response.data.filter(record => record.teleports !== 0)

            //Data already comes sorted by date, we reverse it to extract the nub times in order and reverse it again during the reduce callback.
            const reversedResponse = response.data.reverse()
            const nubRecords = reversedResponse.reduce((prev, curr) => {
                if (curr.time < prev[0].time) {
                    return [curr, ...prev]
                }
                return prev
            }, [reversedResponse[0]])

            return {
                pro:proRecords,
                tp: tpRecords,
                nub: nubRecords
            }
        },
        {
            ...queryOptions
        }
    )
}

export default useMapWRs