import { useMemo } from "react"

import { useOutletContext } from "react-router-dom"

import { TierID } from "@/lib/gokz"
import { useRunType } from "@/components/localsettings/localsettings-provider"
import { PlayerProfileKZData } from "@/hooks/TanStackQueries/usePlayerProfileKZData"

import { PlayerProfileOutletContext } from ".."

import Stats_Completion from "./completion"
import Stats_Playtime from "./playtime"
import Stats_Progression from "./progression"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataTableReloadButton from "@/components/datatable/datatable-reload-button"
import { Skeleton } from "@/components/ui/skeleton"

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

export interface RecordsTopStatistics extends PlayerProfileKZData {
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

    const recordsTopStatistics = useMemo<RecordsTopStatistics | undefined>(() => {
        if (!playerProfileKZData) {
            return undefined
        }

        let statistics: RecordsTopStatistics = {
            ...playerProfileKZData,

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
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}-1`
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

    const StatsLoadingSkeleton = (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-3 h-96" />
                <Skeleton className="col-span-4 h-96" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-96" />
                <Skeleton className="col-span-3 h-96" />
            </div>
        </>
    )

    return (
        <>
            <div className="mb-4 flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Statistics
                </h2>

                <DataTableReloadButton
                    isFetching={playerProfileKZDataFetching}
                    refetch={playerProfileKZDataRefetch}
                />
            </div>
            <Tabs defaultValue="completion" className="space-y-4 py-4">
                <TabsList>
                    <TabsTrigger value="completion">Completion</TabsTrigger>
                    <TabsTrigger value="progression">Progression</TabsTrigger>
                    <TabsTrigger value="playtime">Playtime</TabsTrigger>
                </TabsList>
                <TabsContent value="completion" className="space-y-4">
                    {!playerProfileKZDataFetching ? (
                        recordsTopStatistics ? (
                            <Stats_Completion recordsTopStatistics={recordsTopStatistics} />
                        ) : (
                            "This player doesn't have any stats."
                        )
                    ) : (
                        StatsLoadingSkeleton
                    )}
                </TabsContent>
                <TabsContent value="playtime" className="space-y-4">
                    {!playerProfileKZDataFetching ? (
                        recordsTopStatistics ? (
                            <Stats_Playtime recordsTopStatistics={recordsTopStatistics} />
                        ) : (
                            "This player doesn't have any stats."
                        )
                    ) : (
                        StatsLoadingSkeleton
                    )}
                </TabsContent>
                <TabsContent value="progression" className="space-y-4">
                    {!playerProfileKZDataFetching ? (
                        recordsTopStatistics ? (
                            <Stats_Progression recordsTopStatistics={recordsTopStatistics} />
                        ) : (
                            "This player doesn't have any stats."
                        )
                    ) : (
                        StatsLoadingSkeleton
                    )}
                </TabsContent>
            </Tabs>
        </>
    )
}

export default Stats
