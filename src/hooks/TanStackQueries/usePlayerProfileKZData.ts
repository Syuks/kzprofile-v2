import { useQuery } from "@tanstack/react-query"

import { getGameModeID, GameMode, getKZRank, KZRank, TierID } from "@/lib/gokz"

import { fetchGlobalMaps } from "./useGlobalMaps"
import { fetchGlobalFilters } from "./useGlobalFilters"
import { fetchPlayerTimes, RecordsTop } from "./usePlayerTimes"

interface Completion {
    total: [number, number, number, number, number, number, number]
    done: [number, number, number, number, number, number, number]
}

export interface RecordsTopExtended extends RecordsTop {
    difficulty: TierID
}

export interface Unfinishes {
    map_id: number
    map_name: string
    points: number
    time: number
    difficulty: TierID
    created_on: string
    server_name: string
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
    completions: {
        pro: Completion
        tp: Completion
        nub: Completion
    }
}

const usePlayerProfileKZData = (steamID: string, gameMode: GameMode) => {
    return useQuery({
        queryKey: ["playerProfileKZData", steamID, gameMode],
        queryFn: async () => {
            // Global API Queries needed for proper finishes, rank, points, completions, etc
            const [globalMaps, globalFilters, playerTimes] = await Promise.all([
                fetchGlobalMaps(),
                fetchGlobalFilters(gameMode),
                fetchPlayerTimes(steamID, gameMode),
            ])

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
                completions: {
                    pro: {
                        total: [0, 0, 0, 0, 0, 0, 0],
                        done: [0, 0, 0, 0, 0, 0, 0],
                    },
                    tp: {
                        total: [0, 0, 0, 0, 0, 0, 0],
                        done: [0, 0, 0, 0, 0, 0, 0],
                    },
                    nub: {
                        total: [0, 0, 0, 0, 0, 0, 0],
                        done: [0, 0, 0, 0, 0, 0, 0],
                    },
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
                const filterFound = globalFilters.find(
                    (filter) => globalMap.id === filter.map_id && filter.stage === 0,
                )

                if (!filterFound) return

                // PRO
                playerProfileKZData.completions.pro.total[globalMap.difficulty - 1]++

                const proFinish = playerTimes.pro.find((finish) => globalMap.id === finish.map_id)

                if (proFinish) {
                    playerProfileKZData.finishes.pro.push({
                        ...proFinish,
                        difficulty: globalMap.difficulty,
                    })
                    playerProfileKZData.completions.pro.done[globalMap.difficulty - 1]++
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
                    })
                }

                // TP
                const tpFinish = playerTimes.tp.find((finish) => globalMap.id === finish.map_id)

                if (!globalMap.name.startsWith("kzpro")) {
                    playerProfileKZData.completions.tp.total[globalMap.difficulty - 1]++

                    if (tpFinish) {
                        playerProfileKZData.finishes.tp.push({
                            ...tpFinish,
                            difficulty: globalMap.difficulty,
                        })
                        playerProfileKZData.completions.tp.done[globalMap.difficulty - 1]++
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
                        })
                    }
                }

                // NUB
                playerProfileKZData.completions.nub.total[globalMap.difficulty - 1]++

                const nubFinish = getNubTime(proFinish, tpFinish)

                if (nubFinish) {
                    playerProfileKZData.finishes.nub.push({
                        ...nubFinish,
                        difficulty: globalMap.difficulty,
                    })
                    playerProfileKZData.completions.nub.done[globalMap.difficulty - 1]++
                } else {
                    playerProfileKZData.unfinishes.nub.push({
                        map_id: globalMap.id,
                        map_name: globalMap.name,
                        points: 0,
                        time: 0,
                        difficulty: globalMap.difficulty,
                        created_on: globalMap.created_on,
                        server_name: "",
                    })
                }
            })

            playerProfileKZData.rank = getKZRank(
                getGameModeID(gameMode),
                playerProfileKZData.points.total,
            )

            const totalCompletedMaps =
                playerProfileKZData.finishes.pro.length + playerProfileKZData.finishes.tp.length
            playerProfileKZData.points.average =
                totalCompletedMaps && playerProfileKZData.points.total / totalCompletedMaps // Prevent divided by zero

            return playerProfileKZData
        },
    })
}

export default usePlayerProfileKZData
