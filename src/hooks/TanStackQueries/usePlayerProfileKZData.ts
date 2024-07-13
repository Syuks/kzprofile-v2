import { useQuery, queryOptions, keepPreviousData } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { getGameModeID, GameMode, getKZRank, KZRank, TierID } from "@/lib/gokz"

import { fetchKZProfileMaps } from "./useKZProfileMaps"
import { fetchPlayerTimes, RecordsTop } from "./usePlayerTimes"

export interface RecordsTopExtended extends RecordsTop {
    difficulty: TierID
    mapperNames: string[]
    mapperIds: string[]
}

export interface Unfinishes {
    map_id: number
    map_name: string
    points: number
    time: number
    difficulty: TierID
    created_on: string
    server_name: string
    mapperNames: string[]
    mapperIds: string[]
}

export interface PlayerProfileKZData {
    rank: KZRank
    points: {
        total: number
        average: number
    }
    medals: {
        gold: number
        red: number
        blue: number
    }
    finishes: {
        pro: RecordsTopExtended[]
        tp: RecordsTopExtended[]
        nub: RecordsTopExtended[]
    }
    unfinishes: {
        pro: Unfinishes[]
        tp: Unfinishes[]
        nub: Unfinishes[]
    }
}

const playerProfileKZDataQueryOptions = (steamID: string, gameMode: GameMode) => {
    return queryOptions({
        queryKey: ["playerProfileKZData", steamID, gameMode],
        queryFn: async () => {
            // Global API Queries needed for proper finishes, rank, points, completions, etc
            const [globalMaps, playerTimes] = await Promise.all([
                fetchKZProfileMaps(),
                fetchPlayerTimes(steamID, gameMode),
            ])

            const gameModeID = getGameModeID(gameMode)

            const playerProfileKZData: PlayerProfileKZData = {
                rank: {
                    label: "",
                    prevThreshold: 0,
                    nextThreshold: 0,
                    points: 0,
                    percent: 0,
                    color: "",
                    backgroundColor: "",
                    border: "",
                },
                points: {
                    total: 0,
                    average: 0,
                },
                medals: {
                    gold: 0,
                    red: 0,
                    blue: 0,
                },
                finishes: {
                    pro: [],
                    tp: [],
                    nub: [],
                },
                unfinishes: {
                    pro: [],
                    tp: [],
                    nub: [],
                },
            }

            const addMedal = (points: number): void => {
                if (points === 1000) {
                    playerProfileKZData.medals.gold++
                } else if (points >= 900) {
                    playerProfileKZData.medals.red++
                } else if (points >= 800) {
                    playerProfileKZData.medals.blue++
                }
            }

            const getNubTime = (
                pro: RecordsTop | undefined,
                tp: RecordsTop | undefined,
            ): RecordsTop | undefined => {
                if (!pro) return tp
                if (!tp) return pro

                return pro.time <= tp.time ? pro : tp
            }

            globalMaps.forEach((globalMap) => {
                const filterFound = globalMap.filters.indexOf(gameModeID) !== -1

                if (!filterFound) return

                // PRO
                const proFinish = playerTimes.pro.find((finish) => globalMap.id === finish.map_id)

                if (proFinish) {
                    playerProfileKZData.finishes.pro.push({
                        ...proFinish,
                        difficulty: globalMap.difficulty,
                        mapperNames: globalMap.mapperNames,
                        mapperIds: globalMap.mapperIds,
                    })
                    playerProfileKZData.points.total += proFinish.points
                    addMedal(proFinish.points)
                } else {
                    playerProfileKZData.unfinishes.pro.push({
                        map_id: globalMap.id,
                        map_name: globalMap.name,
                        points: 0,
                        time: 0,
                        difficulty: globalMap.difficulty,
                        created_on: globalMap.created_on,
                        server_name: "",
                        mapperNames: globalMap.mapperNames,
                        mapperIds: globalMap.mapperIds,
                    })
                }

                // TP
                const tpFinish = playerTimes.tp.find((finish) => globalMap.id === finish.map_id)

                if (!globalMap.name.startsWith("kzpro")) {
                    if (tpFinish) {
                        playerProfileKZData.finishes.tp.push({
                            ...tpFinish,
                            difficulty: globalMap.difficulty,
                            mapperNames: globalMap.mapperNames,
                            mapperIds: globalMap.mapperIds,
                        })
                        playerProfileKZData.points.total += tpFinish.points
                        addMedal(tpFinish.points)
                    } else {
                        playerProfileKZData.unfinishes.tp.push({
                            map_id: globalMap.id,
                            map_name: globalMap.name,
                            points: 0,
                            time: 0,
                            difficulty: globalMap.difficulty,
                            created_on: globalMap.created_on,
                            server_name: "",
                            mapperNames: globalMap.mapperNames,
                            mapperIds: globalMap.mapperIds,
                        })
                    }
                }

                // NUB
                const nubFinish = getNubTime(proFinish, tpFinish)

                if (nubFinish) {
                    playerProfileKZData.finishes.nub.push({
                        ...nubFinish,
                        difficulty: globalMap.difficulty,
                        mapperNames: globalMap.mapperNames,
                        mapperIds: globalMap.mapperIds,
                    })
                } else {
                    playerProfileKZData.unfinishes.nub.push({
                        map_id: globalMap.id,
                        map_name: globalMap.name,
                        points: 0,
                        time: 0,
                        difficulty: globalMap.difficulty,
                        created_on: globalMap.created_on,
                        server_name: "",
                        mapperNames: globalMap.mapperNames,
                        mapperIds: globalMap.mapperIds,
                    })
                }
            })

            playerProfileKZData.rank = getKZRank(gameModeID, playerProfileKZData.points.total)

            const totalCompletedMaps =
                playerProfileKZData.finishes.pro.length + playerProfileKZData.finishes.tp.length
            playerProfileKZData.points.average =
                totalCompletedMaps && playerProfileKZData.points.total / totalCompletedMaps // Prevent divided by zero

            return playerProfileKZData
        },
        placeholderData: keepPreviousData,
    })
}

const usePlayerProfileKZData = (steamID: string, gameMode: GameMode) => {
    return useQuery(playerProfileKZDataQueryOptions(steamID, gameMode))
}

const fetchPlayerProfileKZData = (steamID: string, gameMode: GameMode) => {
    return queryClient.fetchQuery(playerProfileKZDataQueryOptions(steamID, gameMode))
}

export default usePlayerProfileKZData
export { fetchPlayerProfileKZData }
