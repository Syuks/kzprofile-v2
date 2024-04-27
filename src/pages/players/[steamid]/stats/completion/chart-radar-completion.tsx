import { useMemo } from "react"

import { tierLabels, tiers } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Radar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Completion_ChartRadarCompletionProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Completion_ChartRadarCompletion({
    recordsTopStatistics,
    className,
}: Completion_ChartRadarCompletionProps) {
    const completionRadarData = useMemo<ChartData<"radar">>(() => {
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
                    backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                    borderColor: "hsla(212, 61%, 61%, 1)",
                },
            ],
        }
    }, [recordsTopStatistics])

    const completionRadarOptions = useMemo<ChartOptions<"radar">>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    grid: {
                        color: "hsl(240 3.7% 15.9%)",
                    },
                    angleLines: {
                        color: "hsl(240 3.7% 15.9%)",
                    },
                    ticks: {
                        display: false,
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
                        label: (context) => `Completion: ${context.parsed.r.toFixed(3)} %`,
                    },
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
                <Radar options={completionRadarOptions} data={completionRadarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Completion_ChartRadarCompletion
