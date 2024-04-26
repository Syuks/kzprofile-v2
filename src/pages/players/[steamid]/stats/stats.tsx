import { useMemo } from "react"

import { ReloadIcon } from "@radix-ui/react-icons"

import { useOutletContext } from "react-router-dom"

import { TierID } from "@/lib/gokz"
import { useRunType } from "@/components/localsettings/localsettings-provider"

import { PlayerProfileOutletContext } from ".."

import Completion_CardCompletion from "./completion/cards-completion"
import Completion_CardFinishes from "./completion/cards-finishes"
import Completion_CardDates from "./completion/cards-dates"
import Completion_CardMappers from "./completion/cards-mappers"
import Completion_CardServers from "./completion/cards-servers"
import Completion_ChartRadarCompletion from "./completion/chart-radar-completion"
import Completion_ChartBarCompletion from "./completion/chart-bar-completion"
import Completion_ChartBarFinishes from "./completion/chart-bar-finishes"
import Completion_TableLastFinish from "./completion/table-last-finish"
import Completion_ChartScatterDays from "./completion/chart-scatter-days"
import Completion_TableMappers from "./completion/table-mappers"
import Completion_ChartBarMappers from "./completion/chart-bar-mappers"
import Completion_TableServers from "./completion/table-servers"
import Completion_ChartBarServers from "./completion/chart-bar-servers"

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
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Completion_CardCompletion recordsTopStatistics={recordsTopStatistics} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Completion_ChartRadarCompletion
                            className="col-span-3"
                            recordsTopStatistics={recordsTopStatistics}
                        />
                        <Completion_ChartBarCompletion
                            className="col-span-4"
                            recordsTopStatistics={recordsTopStatistics}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Completion_CardFinishes recordsTopStatistics={recordsTopStatistics} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Completion_ChartBarFinishes
                            className="col-span-4"
                            recordsTopStatistics={recordsTopStatistics}
                        />
                        <Completion_TableLastFinish
                            className="col-span-3"
                            recordsTopStatistics={recordsTopStatistics}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Completion_CardDates recordsTopStatistics={recordsTopStatistics} />
                    </div>

                    <Completion_ChartScatterDays recordsTopStatistics={recordsTopStatistics} />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Completion_CardMappers recordsTopStatistics={recordsTopStatistics} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Completion_TableMappers
                            className="col-span-3"
                            recordsTopStatistics={recordsTopStatistics}
                        />
                        <Completion_ChartBarMappers
                            className="col-span-4"
                            recordsTopStatistics={recordsTopStatistics}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Completion_CardServers recordsTopStatistics={recordsTopStatistics} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Completion_TableServers
                            className="col-span-3"
                            recordsTopStatistics={recordsTopStatistics}
                        />
                        <Completion_ChartBarServers
                            className="col-span-4"
                            recordsTopStatistics={recordsTopStatistics}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="playtime"></TabsContent>
                <TabsContent value="progression"></TabsContent>
            </Tabs>
        </>
    )
}

export default Stats

/*  Completions
    This tab should have all stats related with a map being completed or unfinished

    Card: Maps finished
    Card: Maps unfinished
    Card: Most played tier (by number of finishes)
    Card: Most completed tier (by %)

    Vertical Bar: Completions per tier
    Table: Last completion per tier
    
    Radar: Completions per tier
    Vertical/horizontal Bar stacked: % completions per tier

    Card: Day with most completions
    Card: Month with most completions
    Card: Quarter with most completions
    Card: Year with most completions

    Bubble: bubbles size = completions per day
    Horizontal line: average completions per day/month/year, so it's smooth and not a lot of spikes
        
    Card: Most completed mapper (by % and the one with most maps)
    Card: Most played mapper (by number of finishes)
    Card: Least completed mapper (by % and the one with most maps)
    Card: Least played mapper (by number of unfinishes)
    
    Table: Completions per mapper
    Vertical bar: most played mapper per tier

    Card: Server with most PBs
    Card: Server with most hard PBs (hard, very hard, extreme, death)
    Card: Server with most easy PBs (very easy, easy, medium)
    Card: Server with least PBs

    Table: PBs per server
    Vertical bar: server with most PBs per tier

    ---

    Playtime
    This tab should have all stats related with the times of each finish

    Card: Shortest run
    Card: Longest run
    Card: Number of short runs (runs under 2 minutes)
    Card: Nmber of long runs (runs over 2 minutes)

    Vertical Bar: Time spent in every tier
    Doughnut: Average time per tier

    Card: Day with most time played
    Card: Month with most time played
    Card: Quarter with most time played
    Card: Year with most time played

    Bubble: bubbles size = time per day
    Horizontal line: average time per day/month/year, so it's smooth and not a lot of spikes

    Card: Mapper with most time played (by % and the one with most maps)
    Card: Mapper with most short runs
    Card: Mapper with most long runs
    Card: Least played mapper

    Table: Time played per mapper
    Vertical bar: most played mapper per tier by time

    Card: Most played Server
    Card: Least played Server
    Card: Server with most short runs
    Card: Server with most long runs

    Table: Servers play time

    ---

    Progression
    This tab should have all stats related with the points of each finish

    Card: Total points
    Card: Map with most points
    Card: Map with least points
    Card: Tier with most points
    Card: Tier with most % of points (gotten vs available)

    Vertical Bar: Points per tier
    Radar: Points per tier normalized (limit is total points gettable per tier)

    Card: Rank
    Card: Next Rank
    Card: Points until next rank
    Card: Rank %

    Stepped Line: Rank progression through time
    
    Card: Number of Wrs
    Card: Number of 900s
    Card: Number of 800s
    Card: Number of Low points
    
    Vertical Bar: Finishes per 100 points
    Doughnut: Average points per tier (I DON'T KNOW ABOUT THIS ONE, MAYBE LEAVE THE VERTICAL BAR TAKE THE WHOLE ROW)

    Card: Most improved month
    Card: Most improved year
    Card: Most improved tier
    Card: Least improved tier

    Line: Points progression through time per tier and all

    Card: Average points
    Card: Tier with best average points
    Card: Tier with worst average points
    Card: Month with best average points

    Line: Average points through time per tier and all

    Card: Day with most points
    Card: Month with most points
    Card: Quarter with most points
    Card: Year with most points

    Bubble: bubbles size = points per day

    Card: Mapper with most points
    Card: Mapper with least points (different to zero)
    Card: Mapper with best average points
    Card: Mapper with most medals (1000s, 900s, 800s)

    Table: Points per mapper
    Vertical bar: mapper with most points per tier

    Card: Server with most points
    Card: Server with least points
    Card: Server with best average points
    Card: Server with most medals (1000s, 900s, 800s)

    Table: Points per Server

    ---

    teleports
    This tab should have all stats related with the teleports of each finish
*/
