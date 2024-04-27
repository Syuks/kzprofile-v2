import { useMemo } from "react"

import { getTimeString } from "@/lib/utils"
import { tierLabels, tiers } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Bar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Playtime_ChartBarAverageProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Playtime_ChartBarAverage({
    recordsTopStatistics,
    className,
}: Playtime_ChartBarAverageProps) {
    const averageTimeByTierBarData = useMemo<ChartData<"bar">>(() => {
        const averageTimePerTier: number[] = tiers.map((tier) => {
            const tierTotalTime = recordsTopStatistics.finishesPerTier[tier].reduce(
                (acc, finish) => acc + finish.time,
                0,
            )

            return tierTotalTime / (recordsTopStatistics.finishesPerTier[tier].length || 1)
        })

        return {
            labels: tierLabels,
            datasets: [
                {
                    label: "Average time",
                    data: averageTimePerTier,
                    borderRadius: 8,
                    backgroundColor: [
                        "hsl(120, 99%, 62%)",
                        "hsl(90, 99%, 64%)",
                        "hsl(55, 75%, 70%)",
                        "hsl(41, 75%, 56%)",
                        "hsl(0, 99%, 62%)",
                        "hsl(0, 100%, 50%)",
                        "hsl(294, 78%, 54%)",
                    ],
                },
            ],
        }
    }, [recordsTopStatistics])

    const averageTimeByTierBarOptions = useMemo<ChartOptions<"bar">>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    ticks: {
                        callback: (value) => getTimeString(value as number),
                    },
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
                        label: (context) => {
                            return `Average time: ${getTimeString(context.parsed.y)}`
                        },
                    },
                },
            },
        }),
        [],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Average time by tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar
                    options={averageTimeByTierBarOptions}
                    data={averageTimeByTierBarData}
                    height={350}
                />
            </CardContent>
        </Card>
    )
}

export default Playtime_ChartBarAverage
