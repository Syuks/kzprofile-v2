import { useMemo } from "react"

import { tierLabels, tiers } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Bar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Completion_ChartBarCompletionProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Completion_ChartBarCompletion({
    recordsTopStatistics,
    className,
}: Completion_ChartBarCompletionProps) {
    const completionBarData = useMemo<ChartData<"bar">>(() => {
        const completionPercentagePerTier: number[] = tiers.map((tier) => {
            const finishesCount = recordsTopStatistics.finishesPerTier[tier].length
            const mapsCount = recordsTopStatistics.mapsPerTier[tier]

            return (finishesCount / mapsCount) * 100
        })

        return {
            labels: tierLabels,
            datasets: [
                {
                    label: "Completion",
                    data: completionPercentagePerTier,
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

    const completionBarOptions = useMemo<ChartOptions<"bar">>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: 0,
                    max: 100,
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
                },
            },
        }),
        [],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Completion per tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar options={completionBarOptions} data={completionBarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Completion_ChartBarCompletion
