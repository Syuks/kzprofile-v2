import { useQuery } from "@tanstack/react-query"
import { GlobalAPI_GetRecordsTop } from "../../utils/APIs/GlobalAPI"

const usePlayerMapTimes = (steamID, gameMode, mapName, mapStage, queryOptions = {}) => {
    return useQuery(
        ["playerMapTimes", steamID, gameMode, mapName, mapStage],
        async () => {
            const baseParams = {
                steamid64: steamID,
                modes_list_string: gameMode,
                map_name: mapName,
                stage: mapStage,
                tickrate: 128,
                limit: 9999
            }

            const { data: playerTimes } = await GlobalAPI_GetRecordsTop(baseParams)
            
            const proFinish = playerTimes.find(time => {
                return time.map_name === mapName && time.teleports === 0
            })

            const tpFinish = playerTimes.find(time => {
                return time.map_name === mapName && time.teleports !== 0
            })

            const getNubTime = (pro, tp) => {
                if (!pro) return tp
                if (!tp) return pro

                return pro.time <= tp.time ? pro : tp
            }

            const nubFinish = getNubTime(proFinish, tpFinish)

            return {
                pro: proFinish,
                tp: tpFinish,
                nub: nubFinish
            }
        },
        {
            ...queryOptions
        }
    )
}

export default usePlayerMapTimes