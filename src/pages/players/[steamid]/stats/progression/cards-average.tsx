import { useMemo } from "react"

import { BarChartIcon } from "@radix-ui/react-icons"

import { format } from "date-fns"

import { TierData, getTierData, tiers } from "@/lib/gokz"
import { cn } from "@/lib/utils"
import { useRunType } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Progression_CardAverageProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface AverageData {
    averagePoints: number
    finishesAmount: number
    bestAverageAllTime: number
    bestAverageAllTimeDate: string
    tierWithBestAveragePoints: TierData
    tierWithBestAveragePointsAmount: number
    tierWithWorstAveragePoints: TierData
    tierWithWorstAveragePointsAmount: number
}

function Progression_CardAverage({ recordsTopStatistics }: Progression_CardAverageProps) {
    const [runType] = useRunType()

    const averageData = useMemo<AverageData>(() => {
        const totalPoints = recordsTopStatistics.finishes[runType].reduce((acc, run) => {
            return acc + run.points
        }, 0)

        const finishesAmount = recordsTopStatistics.finishes[runType].length

        const averagePoints = totalPoints / (finishesAmount || 1)

        let accPoints = 0
        let bestAverageAllTime = 0
        let bestAverageAllTimeDate = ""

        const sortedFinishes = [...recordsTopStatistics.finishes[runType]].sort(
            (runA, runB) =>
                new Date(runA.created_on).getTime() - new Date(runB.created_on).getTime(),
        )

        for (const [index, finish] of sortedFinishes.entries()) {
            accPoints += finish.points

            const averagePointsUntilThisRun = accPoints / (index + 1)

            if (averagePointsUntilThisRun >= bestAverageAllTime) {
                bestAverageAllTime = averagePointsUntilThisRun
                bestAverageAllTimeDate = finish.created_on
            }
        }

        if (bestAverageAllTimeDate !== "") {
            bestAverageAllTimeDate = format(bestAverageAllTimeDate, "MMM do, yyyy")
        }

        const pointsPerTier: number[] = tiers.map((tier) => {
            const totalTierPoints = recordsTopStatistics.finishesPerTier[tier].reduce(
                (acc, finish) => acc + finish.points,
                0,
            )

            return totalTierPoints / (recordsTopStatistics.finishesPerTier[tier].length || 1)
        })

        const tierWithBestAveragePointsAmount = Math.max(...pointsPerTier)

        const maxTierIndex = pointsPerTier.indexOf(tierWithBestAveragePointsAmount)

        const tierWithBestAveragePoints = getTierData(tiers[maxTierIndex])

        const tierWithWorstAveragePointsAmount = Math.min(...pointsPerTier)

        const minTierIndex = pointsPerTier.indexOf(tierWithWorstAveragePointsAmount)

        const tierWithWorstAveragePoints = getTierData(tiers[minTierIndex])

        return {
            averagePoints,
            finishesAmount,
            bestAverageAllTime,
            bestAverageAllTimeDate,
            tierWithBestAveragePoints,
            tierWithBestAveragePointsAmount,
            tierWithWorstAveragePoints,
            tierWithWorstAveragePointsAmount,
        }
    }, [recordsTopStatistics, runType])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average points</CardTitle>
                    <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {averageData.averagePoints.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Out of {averageData.finishesAmount} {runType.toUpperCase()} runs
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Best average points</CardTitle>
                    <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {averageData.bestAverageAllTime.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        On {averageData.bestAverageAllTimeDate}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tier with best average</CardTitle>
                    <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            averageData.tierWithBestAveragePoints.color,
                        )}
                    >
                        {averageData.tierWithBestAveragePoints.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {averageData.tierWithBestAveragePointsAmount.toFixed(2)} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tier with worst average</CardTitle>
                    <BarChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            averageData.tierWithWorstAveragePoints.color,
                        )}
                    >
                        {averageData.tierWithWorstAveragePoints.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {averageData.tierWithWorstAveragePointsAmount.toFixed(2)} points
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Progression_CardAverage
