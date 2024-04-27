import { useMemo } from "react"

import { ReloadIcon } from "@radix-ui/react-icons"

import { useOutletContext } from "react-router-dom"

import { TierID } from "@/lib/gokz"
import { useRunType } from "@/components/localsettings/localsettings-provider"

import { PlayerProfileOutletContext } from ".."

import Stats_Completion from "./completion"
import Stats_Playtime from "./playtime"
import Stats_Progression from "./progression"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface RecordTopStat {
    map_id: number
    map_name: string
    mapperNames: string[]
    mapperIds: string[]
    difficulty: TierID
    points: number
    time: number
    server_name: string
    created_on: string
}

export interface RecordsTopStatistics {
    finishes: RecordTopStat[]
    unfinishes: RecordTopStat[]

    finishesPerTier: Record<TierID, RecordTopStat[]>
    unfinishesPerTier: Record<TierID, RecordTopStat[]>
    mapsPerTier: Record<TierID, number>

    finishesPerDay: Record<string, RecordTopStat[]>
    finishesPerMonth: Record<string, RecordTopStat[]>
    finishesPerQuarter: Record<string, RecordTopStat[]>
    finishesPerYear: Record<string, RecordTopStat[]>

    finishesPerMapper: Record<string, RecordTopStat[]>
    unfinishesPerMapper: Record<string, RecordTopStat[]>
    mapsPerMapper: Record<string, RecordTopStat[]>

    finishesPerServer: Record<string, RecordTopStat[]>
}

function Stats() {
    const { playerProfileKZData, playerProfileKZDataRefetch, playerProfileKZDataFetching } =
        useOutletContext<PlayerProfileOutletContext>()

    const [runType] = useRunType()

    const recordsTopStatistics = useMemo<RecordsTopStatistics>(() => {
        let statistics: RecordsTopStatistics = {
            finishes: playerProfileKZData.finishes[runType],
            unfinishes: playerProfileKZData.unfinishes[runType],

            finishesPerTier: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
            unfinishesPerTier: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] },
            mapsPerTier: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },

            finishesPerDay: {},
            finishesPerMonth: {},
            finishesPerQuarter: {},
            finishesPerYear: {},

            finishesPerMapper: {},
            unfinishesPerMapper: {},
            mapsPerMapper: {},

            finishesPerServer: {},
        }

        for (const finish of playerProfileKZData.finishes[runType]) {
            // Per Tier
            statistics.finishesPerTier[finish.difficulty].push(finish)
            statistics.mapsPerTier[finish.difficulty]++

            // Per Date
            const date = new Date(finish.created_on)
            const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
            const quarterKey = `Q${Math.floor((date.getMonth() + 3) / 3)} ${date.getFullYear()}`
            const yearKey = `${date.getFullYear()}`

            statistics.finishesPerDay[dayKey] = statistics.finishesPerDay[dayKey] || []
            statistics.finishesPerDay[dayKey].push(finish)

            statistics.finishesPerMonth[monthKey] = statistics.finishesPerMonth[monthKey] || []
            statistics.finishesPerMonth[monthKey].push(finish)

            statistics.finishesPerQuarter[quarterKey] =
                statistics.finishesPerQuarter[quarterKey] || []
            statistics.finishesPerQuarter[quarterKey].push(finish)

            statistics.finishesPerYear[yearKey] = statistics.finishesPerYear[yearKey] || []
            statistics.finishesPerYear[yearKey].push(finish)

            // Per Mapper
            for (const mapperName of finish.mapperNames) {
                statistics.finishesPerMapper[mapperName] =
                    statistics.finishesPerMapper[mapperName] || []
                statistics.finishesPerMapper[mapperName].push(finish)

                statistics.mapsPerMapper[mapperName] = statistics.mapsPerMapper[mapperName] || []
                statistics.mapsPerMapper[mapperName].push(finish)
            }

            // Per Server
            statistics.finishesPerServer[finish.server_name] =
                statistics.finishesPerServer[finish.server_name] || []
            statistics.finishesPerServer[finish.server_name].push(finish)
        }

        for (const unfinish of playerProfileKZData.unfinishes[runType]) {
            // Per Tier
            statistics.unfinishesPerTier[unfinish.difficulty].push(unfinish)
            statistics.mapsPerTier[unfinish.difficulty]++

            // Per Mapper
            for (const mapperName of unfinish.mapperNames) {
                statistics.unfinishesPerMapper[mapperName] =
                    statistics.unfinishesPerMapper[mapperName] || []
                statistics.unfinishesPerMapper[mapperName].push(unfinish)

                statistics.mapsPerMapper[mapperName] = statistics.mapsPerMapper[mapperName] || []
                statistics.mapsPerMapper[mapperName].push(unfinish)
            }
        }

        return statistics
    }, [playerProfileKZData, runType])

    return (
        <>
            <div className="mb-4 flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Statistics
                </h2>

                <Button
                    variant="outline"
                    onClick={() => playerProfileKZDataRefetch()}
                    disabled={playerProfileKZDataFetching}
                >
                    {playerProfileKZDataFetching ? (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ReloadIcon className="mr-2 h-4 w-4" />
                    )}
                    Reload
                </Button>
            </div>
            <Tabs defaultValue="completion" className="space-y-4 py-4">
                <TabsList>
                    <TabsTrigger value="completion">Completion</TabsTrigger>
                    <TabsTrigger value="progression">Progression</TabsTrigger>
                    <TabsTrigger value="playtime">Playtime</TabsTrigger>
                </TabsList>
                <TabsContent value="completion" className="space-y-4">
                    <Stats_Completion recordsTopStatistics={recordsTopStatistics} />
                </TabsContent>
                <TabsContent value="playtime" className="space-y-4">
                    <Stats_Playtime recordsTopStatistics={recordsTopStatistics} />
                </TabsContent>
                <TabsContent value="progression" className="space-y-4">
                    <Stats_Progression recordsTopStatistics={recordsTopStatistics} />
                </TabsContent>
            </Tabs>
        </>
    )
}

export default Stats
