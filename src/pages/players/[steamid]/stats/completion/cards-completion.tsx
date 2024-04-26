import { useMemo } from "react"

import { CheckCircledIcon, CrossCircledIcon, LapTimerIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { TierID, getTierData, tiers, type TierData } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Completion_CardCompletionProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface CompletionData {
    mapsFinished: number
    mapsUnfinished: number
    mapsTotal: number
    completionPercentage: number
    incompletionPercentage: number
    mostCompletedTierData: TierData
    mostCompletedTierPercentage: number
    leastCompletedTierData: TierData
    leastCompletedTierPercentage: number
}

function Completion_CardCompletion({ recordsTopStatistics }: Completion_CardCompletionProps) {
    const completionData = useMemo<CompletionData>(() => {
        const mapsFinished = recordsTopStatistics.finishes.length

        const mapsUnfinished = recordsTopStatistics.unfinishes.length

        const mapsTotal = mapsFinished + mapsUnfinished

        const completionPercentage = (mapsFinished / mapsTotal) * 100

        const incompletionPercentage = (mapsUnfinished / mapsTotal) * 100

        const completionPercentagePerTier: Record<TierID, number> = {
            1: recordsTopStatistics.finishesPerTier[1].length / recordsTopStatistics.mapsPerTier[1],
            2: recordsTopStatistics.finishesPerTier[2].length / recordsTopStatistics.mapsPerTier[2],
            3: recordsTopStatistics.finishesPerTier[3].length / recordsTopStatistics.mapsPerTier[3],
            4: recordsTopStatistics.finishesPerTier[4].length / recordsTopStatistics.mapsPerTier[4],
            5: recordsTopStatistics.finishesPerTier[5].length / recordsTopStatistics.mapsPerTier[5],
            6: recordsTopStatistics.finishesPerTier[6].length / recordsTopStatistics.mapsPerTier[6],
            7: recordsTopStatistics.finishesPerTier[7].length / recordsTopStatistics.mapsPerTier[7],
        }

        const maxTier: TierID = tiers.reduce((max, tier) => {
            return completionPercentagePerTier[tier] > completionPercentagePerTier[max] ? tier : max
        })

        const minTier: TierID = tiers.reduce((min, tier) => {
            return completionPercentagePerTier[tier] < completionPercentagePerTier[min] ? tier : min
        })

        const mostCompletedTierData = getTierData(maxTier)

        const mostCompletedTierPercentage = completionPercentagePerTier[maxTier] * 100

        const leastCompletedTierData = getTierData(minTier)

        const leastCompletedTierPercentage = completionPercentagePerTier[minTier] * 100

        return {
            mapsFinished,
            mapsUnfinished,
            mapsTotal,
            completionPercentage,
            incompletionPercentage,
            mostCompletedTierData,
            mostCompletedTierPercentage,
            leastCompletedTierData,
            leastCompletedTierPercentage,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion percentage</CardTitle>
                    <CheckCircledIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {completionData.completionPercentage.toFixed(3)} %
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {completionData.mapsFinished}/{completionData.mapsTotal} maps
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Incompletion percentage</CardTitle>
                    <CrossCircledIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {completionData.incompletionPercentage.toFixed(3)} %
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {completionData.mapsUnfinished}/{completionData.mapsTotal} maps
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Most completed tier</CardTitle>
                    <LapTimerIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            completionData.mostCompletedTierData.color,
                        )}
                    >
                        {completionData.mostCompletedTierData.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {completionData.mostCompletedTierPercentage.toFixed(3)} %
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Least completed tier</CardTitle>
                    <LapTimerIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            completionData.leastCompletedTierData.color,
                        )}
                    >
                        {completionData.leastCompletedTierData.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {completionData.leastCompletedTierPercentage.toFixed(3)} %
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Completion_CardCompletion
