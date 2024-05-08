import { useMemo } from "react"

import { lightFormat } from "date-fns"

import { useLocalSettings, useRunType } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics } from "../stats"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface AveragePointsData {
    averagePoints: number
    date: string
}

interface Progression_TableAverageProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Progression_TableAverage({
    recordsTopStatistics,
    className,
}: Progression_TableAverageProps) {
    const [localSettings] = useLocalSettings()

    const [runType] = useRunType()

    const bestAveragePoints = useMemo<AveragePointsData[]>(() => {
        let accPoints = 0
        let averagePointsData: AveragePointsData[] = []

        const sortedFinishes = [...recordsTopStatistics.finishes[runType]].sort(
            (runA, runB) =>
                new Date(runA.created_on).getTime() - new Date(runB.created_on).getTime(),
        )

        for (const [index, finish] of sortedFinishes.entries()) {
            accPoints += finish.points

            const averagePointsUntilThisRun = accPoints / (index + 1)

            averagePointsData.push({
                averagePoints: averagePointsUntilThisRun,
                date: finish.created_on,
            })
        }

        return averagePointsData
            .sort((averageA, averageB) => averageB.averagePoints - averageA.averagePoints)
            .slice(0, 6)
    }, [recordsTopStatistics, runType])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Best average points</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Average</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bestAveragePoints.map((averageData, index) => {
                            const dateString = lightFormat(
                                averageData.date,
                                localSettings.dateFormat,
                            )

                            return (
                                <TableRow key={index}>
                                    <TableCell className="h-12">
                                        {averageData.averagePoints.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">{dateString}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default Progression_TableAverage
