import { useMemo } from "react"

import { format } from "date-fns"

import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics } from "../stats"

import { Line } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Progression_ChartLinePointsProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Progression_ChartLinePoints({
    recordsTopStatistics,
    className,
}: Progression_ChartLinePointsProps) {
    const [runType] = useRunType()
    const [gameMode] = useGameMode()

    const pointsLineData = useMemo<ChartData<"line">>(() => {
        let acc = 0
        let accPointsData: { x: number; y: number }[] = []

        const sortedFinishes = [...recordsTopStatistics.finishes[runType]].sort(
            (runA, runB) =>
                new Date(runA.created_on).getTime() - new Date(runB.created_on).getTime(),
        )

        for (const finish of sortedFinishes) {
            acc += finish.points

            accPointsData.push({
                x: new Date(finish.created_on).getTime(),
                y: acc,
            })
        }

        /*averagePoints.push({
            x: new Date().getTime(),
            y: acc,
        })*/

        return {
            datasets: [
                {
                    label: "Points",
                    data: accPointsData,
                    //cubicInterpolationMode: "monotone",
                    pointRadius: 0,
                    pointHitRadius: 1,
                    backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                    borderColor: "hsla(212, 61%, 61%, 1)",
                },
            ],
        }
    }, [recordsTopStatistics, runType, gameMode])

    const pointsLineOptions = useMemo<ChartOptions<"line">>(
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
                    },
                },
            },
        }),
        [gameMode],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Cumulative points</CardTitle>
            </CardHeader>
            <CardContent>
                <Line options={pointsLineOptions} data={pointsLineData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Progression_ChartLinePoints
