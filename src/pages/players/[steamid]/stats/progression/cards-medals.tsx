import { useMemo } from "react"

import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import GoldMedal from "@/assets/medals/1000.png"
import RedMedal from "@/assets/medals/900.png"
import BlueMedal from "@/assets/medals/800.png"
import BlueMedalEmpty from "@/assets/medals/800-empty.png"

interface Progression_CardMedalsProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface MedalsData {
    amount1000s: number
    amount900s: number
    amount800s: number
    amountLowPoints: number
}

function Progression_CardMedals({ recordsTopStatistics }: Progression_CardMedalsProps) {
    const [runType] = useRunType()
    const [gameMode] = useGameMode()

    const medalsData = useMemo<MedalsData>(() => {
        let amount1000s = 0
        let amount900s = 0
        let amount800s = 0
        let amountLowPoints = 0

        for (const finish of recordsTopStatistics.finishes[runType]) {
            const points = finish.points

            if (points === 1000) {
                amount1000s++
            } else if (points >= 900) {
                amount900s++
            } else if (points >= 800) {
                amount800s++
            } else {
                amountLowPoints++
            }
        }

        /*
        // This method is runType agnostic
        const amount1000s = recordsTopStatistics.medals.gold
        const amount900s = recordsTopStatistics.medals.red
        const amount800s = recordsTopStatistics.medals.blue
        const amountLowPoints = recordsTopStatistics.finishes.pro.length + recordsTopStatistics.finishes.tp.length - amount1000s - amount900s - amount800s
        */

        return {
            amount1000s,
            amount900s,
            amount800s,
            amountLowPoints,
        }
    }, [recordsTopStatistics, runType])

    return (
        <>
            <Card>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gold medals</CardTitle>
                    <div className="absolute right-4 top-4 h-14 w-14">
                        <img src={GoldMedal} alt="1000-medal" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {medalsData.amount1000s.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        1000 points in {runType.toLocaleUpperCase()} {gameMode}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Red medals</CardTitle>
                    <div className="absolute right-4 top-4 h-12 w-12">
                        <img src={RedMedal} alt="900-medal" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {medalsData.amount900s.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        900 points in {runType.toLocaleUpperCase()} {gameMode}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Blue medals</CardTitle>
                    <div className="absolute right-4 top-4 h-12 w-12">
                        <img src={BlueMedal} alt="800-medal" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {medalsData.amount800s.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        800 points in {runType.toLocaleUpperCase()} {gameMode}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low points runs</CardTitle>
                    <div className="absolute right-4 top-4 h-12 w-12">
                        <img src={BlueMedalEmpty} alt="low-points-medal" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {medalsData.amountLowPoints.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Less than 800 points in {runType.toLocaleUpperCase()} {gameMode}
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Progression_CardMedals
