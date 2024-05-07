import { useMemo } from "react"

import { StopwatchIcon, LapTimerIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { getTierData, tiers, type TierData } from "@/lib/gokz"
import { useRunType } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Progression_CardTiersProps {
    recordsTopStatistics: RecordsTopStatistics
}

export interface TierProgressionData {
    tierData: TierData
    points: number
    pointsPercentage: number
}

interface TiersProgressionData {
    tierWithMostPoints: TierProgressionData
    tierWithFewerPoints: TierProgressionData
    bestTierPercentage: TierProgressionData
    worstTierPercentage: TierProgressionData
}

function Progression_CardTiers({ recordsTopStatistics }: Progression_CardTiersProps) {
    const [runType] = useRunType()

    const tiersProgressionData = useMemo<TiersProgressionData>(() => {
        const tiersArray: TierProgressionData[] = tiers
            .map((tier) => {
                const tierData = getTierData(tier)

                const points = recordsTopStatistics.finishesPerTier[tier].reduce((acc, run) => {
                    return acc + run.points
                }, 0)

                const pointsPercentage =
                    (points / (recordsTopStatistics.mapsPerTier[tier] * 1000)) * 100

                return {
                    tierData,
                    points,
                    pointsPercentage,
                }
            })
            .sort((tierA, tierB) => tierB.points - tierA.points)

        const tierWithMostPoints = tiersArray[0]

        const tierWithFewerPoints = tiersArray.slice(-1)[0]

        const tiersArrayByPercentage = [...tiersArray].sort(
            (tierA, tierB) => tierB.pointsPercentage - tierA.pointsPercentage,
        )

        const bestTierPercentage = tiersArrayByPercentage[0]

        const worstTierPercentage = tiersArrayByPercentage.slice(-1)[0]

        return {
            tierWithMostPoints,
            tierWithFewerPoints,
            bestTierPercentage,
            worstTierPercentage,
        }
    }, [recordsTopStatistics, runType])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tier with most points</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            tiersProgressionData.tierWithMostPoints.tierData.color,
                        )}
                    >
                        {tiersProgressionData.tierWithMostPoints.tierData.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {tiersProgressionData.tierWithMostPoints.points.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tier with fewer points</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            tiersProgressionData.tierWithFewerPoints.tierData.color,
                        )}
                    >
                        {tiersProgressionData.tierWithFewerPoints.tierData.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {tiersProgressionData.tierWithFewerPoints.points.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Best tier percentage</CardTitle>
                    <LapTimerIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            tiersProgressionData.bestTierPercentage.tierData.color,
                        )}
                    >
                        {tiersProgressionData.bestTierPercentage.tierData.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {tiersProgressionData.bestTierPercentage.pointsPercentage.toFixed(3)} %
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Worst tier percentage</CardTitle>
                    <LapTimerIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            tiersProgressionData.worstTierPercentage.tierData.color,
                        )}
                    >
                        {tiersProgressionData.worstTierPercentage.tierData.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {tiersProgressionData.worstTierPercentage.pointsPercentage.toFixed(3)} %
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Progression_CardTiers
