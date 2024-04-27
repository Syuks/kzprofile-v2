import { useMemo } from "react"

import { StopwatchIcon } from "@radix-ui/react-icons"

import { getTimeString } from "@/lib/utils"

import { RecordsTopStatistics, RecordTopStat } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Playtime_CardRunsProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface RunsData {
    shortestRun: RecordTopStat
    longestRun: RecordTopStat
    totalTime: number
    averageTime: number
}

function Playtime_CardRuns({ recordsTopStatistics }: Playtime_CardRunsProps) {
    const runsData = useMemo<RunsData>(() => {
        const shortestRun = recordsTopStatistics.finishes.reduce((min, run) => {
            return run.time < min.time ? run : min
        })

        const longestRun = recordsTopStatistics.finishes.reduce((max, run) => {
            return run.time > max.time ? run : max
        })

        const totalTime = recordsTopStatistics.finishes.reduce((acc, finish) => {
            return acc + finish.time
        }, 0)

        const averageTime = totalTime / (recordsTopStatistics.finishes.length || 1)

        return {
            shortestRun,
            longestRun,
            totalTime,
            averageTime,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total time</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {getTimeString(runsData.totalTime)}
                    </div>
                    <p className="text-xs text-muted-foreground">Only PBs are considered</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average time</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {getTimeString(runsData.averageTime)}
                    </div>
                    <p className="text-xs text-muted-foreground">Only PBs are considered</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Shortest run</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {getTimeString(runsData.shortestRun.time)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {runsData.shortestRun.points} points in {runsData.shortestRun.map_name}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Longest run</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {getTimeString(runsData.longestRun.time)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {runsData.longestRun.points} points in {runsData.longestRun.map_name}
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Playtime_CardRuns
