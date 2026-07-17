import { useQuery, queryOptions } from "@tanstack/react-query"

import { getGameModeName, type GameMode } from "@/lib/gokz"
import { queryClient } from "@/main"

import { GlobalAPI_GetRecordsTop, type GetRecordsTopParams } from "./APIs/GlobalAPI"

export interface RecordsTop {
  id: number
  steamid64: string
  player_name: string
  steam_id: string
  server_id: number
  map_id: number
  stage: number
  mode: string
  tickrate: number
  time: number
  teleports: number
  created_on: string
  updated_on: string
  updated_by: number
  record_filter_id: number
  server_name: string
  map_name: string
  points: number
  replay_id: number
}

/*interface PlayerTimes {
    pro: RecordsTop[]
    tp: RecordsTop[]
}*/

const playerTimesQueryOptions = (steamID: string, gameMode: GameMode, gokzTop: boolean = false) => {
  return queryOptions({
    queryKey: ["playerTimes", steamID, gameMode, gokzTop],
    queryFn: async () => {
      const baseParams: GetRecordsTopParams = {
        steamid64: steamID,
        modes_list_string: getGameModeName(gameMode),
        stage: 0,
        tickrate: 128,
        limit: 9999,
      }

      const [proResponse, tpResponse] = await Promise.all([
        GlobalAPI_GetRecordsTop({ ...baseParams, has_teleports: false }, gokzTop),
        GlobalAPI_GetRecordsTop({ ...baseParams, has_teleports: true }, gokzTop),
      ])

      const proJson: RecordsTop[] = await proResponse.json()
      const tpJson: RecordsTop[] = await tpResponse.json()

      return {
        pro: proJson,
        tp: tpJson,
      }
    },
  })
}

const usePlayerTimes = (steamID: string, gameMode: GameMode, gokzTop: boolean = false) => {
  return useQuery(playerTimesQueryOptions(steamID, gameMode, gokzTop))
}

const fetchPlayerTimes = (steamID: string, gameMode: GameMode, gokzTop: boolean = false) => {
  return queryClient.fetchQuery(playerTimesQueryOptions(steamID, gameMode, gokzTop))
}

export default usePlayerTimes
export { fetchPlayerTimes }
