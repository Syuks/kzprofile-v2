import { useQuery } from "@tanstack/react-query"
import { GlobalAPI_GetRecordsTop } from "../../utils/APIs/GlobalAPI"

/*const clearDuplicates = (data) => {
    let nubData = []
    
    const all_finishes = data.sort((a, b) => a.time - b.time)
    
    const mapTimeCache = new Map()
    
    all_finishes.forEach(finish => {
        const key = finish.map_id
        
        if (!mapTimeCache.has(key)) {
            nubData.push(finish)
            mapTimeCache.set(key, true)
        }
    })

    return nubData
}*/

const usePlayerTimes = (steamID, gameMode, queryOptions = {}) => {
    return useQuery(
        ["playerTimes", steamID, gameMode],
        async () => {
            const baseParams = {
                steamid64: steamID,
                modes_list_string: gameMode,
                stage: 0,
                tickrate: 128,
                limit: 9999
            }

            const [proResponse, tpResponse] = await Promise.all([
                GlobalAPI_GetRecordsTop({...baseParams, has_teleports: false}),
                GlobalAPI_GetRecordsTop({...baseParams, has_teleports: true})
            ])
            
            return {
                pro: proResponse.data,
                tp: tpResponse.data
            }
        },
        {
            ...queryOptions
        }
    )
}

export default usePlayerTimes