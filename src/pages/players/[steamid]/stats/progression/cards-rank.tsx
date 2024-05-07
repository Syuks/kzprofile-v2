import { useMemo } from "react"

import { DoubleArrowUpIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { type KZRank, getKZRank } from "@/lib/gokz"
import { useGameMode } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Progression_CardRanksProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface RankData {
    currentRankData: KZRank
    currentRankPercentage: number
    nextRankData: KZRank
    pointsUntilNextRank: number
}

function Progression_CardRanks({ recordsTopStatistics }: Progression_CardRanksProps) {
    const [gameMode] = useGameMode()

    const rankData = useMemo<RankData>(() => {
        const currentRankData = recordsTopStatistics.rank

        const currentRankPercentage = recordsTopStatistics.rank.percent * 100

        const nextRankData = getKZRank(gameMode, recordsTopStatistics.rank.nextThreshold + 1)

        const pointsUntilNextRank =
            recordsTopStatistics.rank.nextThreshold - recordsTopStatistics.rank.points

        return {
            currentRankData,
            currentRankPercentage,
            nextRankData,
            pointsUntilNextRank,
        }
    }, [recordsTopStatistics, gameMode])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rank</CardTitle>
                    <DoubleArrowUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div
                        className={cn(
                            "truncate text-2xl font-bold",
                            rankData.currentRankData.color,
                        )}
                    >
                        {rankData.currentRankData.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {rankData.currentRankData.points.toLocaleString()} points in {gameMode}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rank percentage</CardTitle>
                    <DoubleArrowUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {rankData.currentRankPercentage.toFixed(3)} %
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {(100 - rankData.currentRankPercentage).toFixed(3)} % left
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Next rank</CardTitle>
                    <DoubleArrowUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={cn("truncate text-2xl font-bold", rankData.nextRankData.color)}>
                        {rankData.nextRankData.label}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        At {rankData.currentRankData.nextThreshold.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Points until next rank</CardTitle>
                    <DoubleArrowUpIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {rankData.pointsUntilNextRank.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Of{" "}
                        {(
                            rankData.currentRankData.nextThreshold -
                            rankData.currentRankData.prevThreshold
                        ).toLocaleString()}{" "}
                        points
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Progression_CardRanks
