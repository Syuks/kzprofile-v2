import { useQuery } from "@tanstack/react-query"
import { GlobalAPI_GetRecordsTop, GetRecordsTopParams } from "./APIs/GlobalAPI"

import { getGameModeName, GameMode } from "@/lib/gokz"

import type { RecordsTop } from "./usePlayerTimes"

const usePlayerMapTimes = (
    steamID: string,
    gameMode: GameMode,
    mapName: string,
    mapStage: number,
) => {
    return useQuery({
        queryKey: ["playerMapTimes", steamID, gameMode, mapName, mapStage],
        queryFn: async () => {
            const baseParams: GetRecordsTopParams = {
                steamid64: steamID,
                modes_list_string: getGameModeName(gameMode),
                map_name: mapName,
                stage: mapStage,
                tickrate: 128,
                limit: 9999,
            }

            const response = await GlobalAPI_GetRecordsTop(baseParams)
            const json: RecordsTop[] = await response.json()

            const proFinish = json.find((time) => {
                return time.map_name === mapName && time.teleports === 0
            })

            const tpFinish = json.find((time) => {
                return time.map_name === mapName && time.teleports !== 0
            })

            const getNubTime = (pro: RecordsTop | undefined, tp: RecordsTop | undefined) => {
                if (!pro) return tp
                if (!tp) return pro

                return pro.time <= tp.time ? pro : tp
            }

            const nubFinish = getNubTime(proFinish, tpFinish)

            return {
                pro: proFinish,
                tp: tpFinish,
                nub: nubFinish,
            }
        },
    })
}

export default usePlayerMapTimes
