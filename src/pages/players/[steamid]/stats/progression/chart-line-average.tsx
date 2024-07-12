import { useMemo } from "react"

import { format } from "date-fns"

import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics } from "../stats"

import { Line } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Progression_ChartLineAverageProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Progression_ChartLineAverage({
    recordsTopStatistics,
    className,
}: Progression_ChartLineAverageProps) {
    const [runType] = useRunType()
    const [gameMode] = useGameMode()

    const averageLineData = useMemo<ChartData<"line">>(() => {
        let accPoints = 0
        let averagePoints: { x: number; y: number }[] = []

        const sortedFinishes = [...recordsTopStatistics.finishes[runType]].sort(
            (runA, runB) =>
                new Date(runA.created_on).getTime() - new Date(runB.created_on).getTime(),
        )

        for (const [index, finish] of sortedFinishes.entries()) {
            accPoints += finish.points

            const averagePointsUntilThisRun = accPoints / (index + 1)

            averagePoints.push({
                x: new Date(finish.created_on).getTime(),
                y: averagePointsUntilThisRun,
            })
        }

        /*averagePoints.push({
            x: new Date().getTime(),
            y: averagePoints.slice(-1)[0].y,
        })*/

        return {
            datasets: [
                {
                    label: "Average",
                    data: averagePoints,
                    cubicInterpolationMode: "monotone",
                    pointRadius: 0,
                    pointHitRadius: 1,
                    backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                    borderColor: "hsla(212, 61%, 61%, 1)",
                },
            ],
        }
    }, [recordsTopStatistics, runType, gameMode])

    const averageLineOptions = useMemo<ChartOptions<"line">>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "time",
                },
                y: {
                    min: 0,
                },
            },
            interaction: {
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    borderWidth: 1,
                    borderColor: "hsl(240 3.7% 15.9%)",
                    backgroundColor: "hsl(240 10% 3.9%)",
                    padding: 8,
                    titleFont: { size: 14 },
                    bodyFont: { size: 14 },
                    caretSize: 0,
                    displayColors: false,
                    callbacks: {
                        title: (context) => format(context[0].parsed.x, "MMM do, yyyy"),
                        label: (context) => `Average: ${context.parsed.y.toFixed(2)}`,
                    },
                },
            },
        }),
        [gameMode],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Average points</CardTitle>
            </CardHeader>
            <CardContent>
                <Line options={averageLineOptions} data={averageLineData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Progression_ChartLineAverage
