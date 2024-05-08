import { useMemo } from "react"

import { tierLabels, tiers } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Bar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Progression_ChartBarTiersAverageProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Progression_ChartBarTiersAverage({
    recordsTopStatistics,
    className,
}: Progression_ChartBarTiersAverageProps) {
    const tiersAverageBarData = useMemo<ChartData<"bar">>(() => {
        const averagePointsPerTier: number[] = tiers.map((tier) => {
            const tierTotalPoints = recordsTopStatistics.finishesPerTier[tier].reduce(
                (acc, run) => {
                    return acc + run.points
                },
                0,
            )

            return tierTotalPoints / (recordsTopStatistics.finishesPerTier[tier].length || 1)
        })

        return {
            labels: tierLabels,
            datasets: [
                {
                    label: "Average",
                    data: averagePointsPerTier,
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

    const tiersAverageBarOptions = useMemo<ChartOptions<"bar">>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
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
                        label: (context) => `Average: ${context.parsed.y.toFixed(2)}`,
                    },
                },
            },
        }),
        [],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Average points per tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar options={tiersAverageBarOptions} data={tiersAverageBarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Progression_ChartBarTiersAverage
