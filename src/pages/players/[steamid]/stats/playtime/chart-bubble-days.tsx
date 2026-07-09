import { useMemo } from "react"

import { format } from "date-fns"

import { getTimeString } from "@/lib/utils"

import type { RecordsTopStatistics } from "../stats"

import { Bubble } from "react-chartjs-2"
import type { ChartConfiguration } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Playtime_ChartBubbleDaysProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Playtime_ChartBubbleDays({
    recordsTopStatistics,
    className,
}: Playtime_ChartBubbleDaysProps) {
    const playtimePerDayBubbleConfiguration = useMemo<ChartConfiguration<"bubble">>(() => {
        const finishesPerDay = Object.entries(recordsTopStatistics.finishesPerDay).map(
            ([date, finishes]) => ({
                x: new Date(date).getTime(),
                y: finishes.length,
            }),
        )

        const playtimePerDay = Object.values(recordsTopStatistics.finishesPerDay).map(
            (finishes) => {
                const dayPlaytime = finishes.reduce((acc, finish) => {
                    return acc + finish.time
                }, 0)

                return dayPlaytime
            },
        )

        const dayWithMostPlaytime = [...playtimePerDay].sort(
            (playtimeA, playtimeB) => playtimeB - playtimeA,
        )[0]

        return {
            type: "bubble",
            data: {
                datasets: [
                    {
                        label: "Playtime",
                        data: finishesPerDay,
                        backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                        borderColor: "hsla(212, 61%, 61%, 1)",
                        radius: (context) => {
                            const chartSize = context.chart.width
                            const playtime = playtimePerDay[context.dataIndex]
                            const base = playtime / dayWithMostPlaytime
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
                            title: (context) => {
                                const timestamp = context[0]?.parsed.x

                                if (timestamp === null || timestamp === undefined) {
                                    return ""
                                }

                                return format(timestamp, "MMM do, yyyy")
                            },
                            label: (context) => {
                                const playtime = playtimePerDay[context.dataIndex]

                                if (playtime === undefined) {
                                    return ""
                                }

                                return `Playtime: ${getTimeString(playtime)}`
                            },
                            footer: (context) => {
                                const finishes = context[0]?.parsed.y

                                if (finishes === null || finishes === undefined) {
                                    return ""
                                }

                                return `Finishes: ${finishes}`
                            },
                        },
                    },
                },
            },
        }
    }, [recordsTopStatistics])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Playtime per day</CardTitle>
            </CardHeader>
            <CardContent>
                <Bubble
                    options={playtimePerDayBubbleConfiguration.options}
                    data={playtimePerDayBubbleConfiguration.data}
                    height={350}
                />
            </CardContent>
        </Card>
    )
}

export default Playtime_ChartBubbleDays
