import { useMemo } from "react"

import { CheckCircledIcon, CrossCircledIcon, StopwatchIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { TierID, getTierData, tiers, type TierData } from "@/lib/gokz"
import { useRunType } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Completion_CardFinishesProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface FinishesData {
    mapsFinished: number
    mapsUnfinished: number
    mapsTotal: number
    tierWithMostFinishesData: TierData
    tierWithMostFinishesAmount: number
    tierWithFewerFinishesData: TierData
    tierWithFewerFinishesAmount: number
}

function Completion_CardFinishes({ recordsTopStatistics }: Completion_CardFinishesProps) {
    const [runType] = useRunType()

    const finishesData = useMemo<FinishesData>(() => {
        const mapsFinished = recordsTopStatistics.finishes[runType].length

        const mapsUnfinished = recordsTopStatistics.unfinishes[runType].length

        const mapsTotal = mapsFinished + mapsUnfinished

        const maxTier: TierID = tiers.reduce((max, tier) => {
            return recordsTopStatistics.finishesPerTier[tier].length >
                recordsTopStatistics.finishesPerTier[max].length
                ? tier
                : max
        })

        const minTier: TierID = tiers.reduce((min, tier) => {
            return recordsTopStatistics.finishesPerTier[tier].length <
                recordsTopStatistics.finishesPerTier[min].length
                ? tier
                : min
        })

        const tierWithMostFinishesData = getTierData(maxTier)

        const tierWithMostFinishesAmount = recordsTopStatistics.finishesPerTier[maxTier].length

        const tierWithFewerFinishesData = getTierData(minTier)

        const tierWithFewerFinishesAmount = recordsTopStatistics.finishesPerTier[minTier].length

        return {
            mapsFinished,
            mapsUnfinished,
            mapsTotal,
            tierWithMostFinishesData,
            tierWithMostFinishesAmount,
            tierWithFewerFinishesData,
            tierWithFewerFinishesAmount,
        }
    }, [recordsTopStatistics, runType])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Maps finished</CardTitle>
                    <CheckCircledIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">{finishesData.mapsFinished}</div>
                    <p className="text-xs text-muted-foreground">
                        Out of {finishesData.mapsTotal} maps
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Maps unfinished</CardTitle>
                    <CrossCircledIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">{finishesData.mapsUnfinished}</div>
                    <p className="text-xs text-muted-foreground">
                        Out of {finishesData.mapsTotal} maps
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tier with most finishes</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            finishesData.tierWithMostFinishesData.color,
                        )}
                    >
                        {finishesData.tierWithMostFinishesData.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {finishesData.tierWithMostFinishesAmount} finishes
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tier with fewer finishes</CardTitle>
                    <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            finishesData.tierWithFewerFinishesData.color,
                        )}
                    >
                        {finishesData.tierWithFewerFinishesData.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {finishesData.tierWithFewerFinishesAmount} finishes
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Completion_CardFinishes
