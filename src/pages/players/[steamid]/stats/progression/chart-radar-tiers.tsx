import { useMemo } from "react"

import { tierLabels, tiers } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Radar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Progression_ChartRadarTiersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Progression_ChartRadarTiers({
    recordsTopStatistics,
    className,
}: Progression_ChartRadarTiersProps) {
    const tiersRadarData = useMemo<ChartData<"radar">>(() => {
        const percentagePerTier: number[] = tiers.map((tier) => {
            const points = recordsTopStatistics.finishesPerTier[tier].reduce((acc, run) => {
                return acc + run.points
            }, 0)

            return (points / (recordsTopStatistics.mapsPerTier[tier] * 1000)) * 100
        })

        return {
            labels: tierLabels,
            datasets: [
                {
                    label: "Percentage",
                    data: percentagePerTier,
                    backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                    borderColor: "hsla(212, 61%, 61%, 1)",
                },
            ],
        }
    }, [recordsTopStatistics])

    const tiersRadarOptions = useMemo<ChartOptions<"radar">>(
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
                        label: (context) => `Percentage: ${context.parsed.r.toFixed(3)} %`,
                    },
                },
            },
        }),
        [],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Points percentage per tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Radar options={tiersRadarOptions} data={tiersRadarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Progression_ChartRadarTiers
