import { useMemo } from "react"

import { StopwatchIcon, ImageIcon } from "@radix-ui/react-icons"

import { useRunType } from "@/components/localsettings/localsettings-provider"
import { RecordsTopExtended } from "@/hooks/TanStackQueries/usePlayerProfileKZData"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Progression_CardPointsProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface PointsData {
    totalPoints: number
    pointsPercentage: number
    mapMostPoints: RecordsTopExtended
    mapFewerPoints: RecordsTopExtended
}

function Progression_CardPoints({ recordsTopStatistics }: Progression_CardPointsProps) {
    const [runType] = useRunType()

    const pointsData = useMemo<PointsData>(() => {
        const totalPoints = recordsTopStatistics.finishes[runType].reduce((acc, run) => {
            return acc + run.points
        }, 0)

        const pointsPercentage =
            (totalPoints /
                ((recordsTopStatistics.finishes[runType].length +
                    recordsTopStatistics.unfinishes[runType].length) *
                    1000)) *
            100

        const mapMostPoints = recordsTopStatistics.finishes[runType].reduce((most, run) => {
            return run.points > most.points ? run : most
        })

        const mapFewerPoints = recordsTopStatistics.finishes[runType].reduce((fewer, run) => {
            return run.points < fewer.points ? run : fewer
        })

        return {
            totalPoints,
            pointsPercentage,
            mapMostPoints,
            mapFewerPoints,
        }
    }, [recordsTopStatistics, runType])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total points</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {pointsData.totalPoints.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">From this run type</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Points percentage</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {pointsData.pointsPercentage.toFixed(3)} %
                    </div>
                    <p className="text-xs text-muted-foreground">Over all available points</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Map with most points</CardTitle>
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {pointsData.mapMostPoints.map_name}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {pointsData.mapMostPoints.points} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Map with fewer points</CardTitle>
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {pointsData.mapFewerPoints.map_name}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {pointsData.mapFewerPoints.points} points
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Progression_CardPoints
