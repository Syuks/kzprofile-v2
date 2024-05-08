import { useMemo } from "react"

import { format } from "date-fns"

import { RecordsTopStatistics } from "../stats"

import { Bubble } from "react-chartjs-2"
import type { ChartConfiguration } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Progression_ChartBubbleDaysProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Progression_ChartBubbleDays({
    recordsTopStatistics,
    className,
}: Progression_ChartBubbleDaysProps) {
    const pointsPerDayBubbleConfiguration = useMemo<ChartConfiguration<"bubble">>(() => {
        const finishesPerDay = Object.entries(recordsTopStatistics.finishesPerDay).map(
            ([date, finishes]) => ({
                x: new Date(date).getTime(),
                y: finishes.length,
            }),
        )

        const pointsPerDay = Object.values(recordsTopStatistics.finishesPerDay).map((finishes) => {
            const dayPoints = finishes.reduce((acc, finish) => {
                return acc + finish.points
            }, 0)

            return dayPoints
        })

        const dayWithMostPoints = [...pointsPerDay].sort((pointsA, pointsB) => pointsB - pointsA)[0]

        return {
            type: "bubble",
            data: {
                datasets: [
                    {
                        label: "Points",
                        data: finishesPerDay,
                        backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                        borderColor: "hsla(212, 61%, 61%, 1)",
                        radius: (context) => {
                            const chartSize = context.chart.width
                            const points = pointsPerDay[context.dataIndex]
                            const base = points / dayWithMostPoints
                            return (chartSize / 24) * base
                        },
                    },
                ],
            },
            options: {
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
                            label: (context) =>
                                `Points: ${pointsPerDay[context.dataIndex].toLocaleString()}`,
                            footer: (context) => `Finishes: ${context[0].parsed.y}`,
                        },
                    },
                },
            },
        }
    }, [recordsTopStatistics])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Points per day</CardTitle>
            </CardHeader>
            <CardContent>
                <Bubble
                    options={pointsPerDayBubbleConfiguration.options}
                    data={pointsPerDayBubbleConfiguration.data}
                    height={350}
                />
            </CardContent>
        </Card>
    )
}

export default Progression_ChartBubbleDays
