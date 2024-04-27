import { useMemo } from "react"

import { getTimeString } from "@/lib/utils"
import { tierLabels, tiers } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Doughnut } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Playtime_ChartDoughnutTiersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Playtime_ChartDoughnutTiers({
    recordsTopStatistics,
    className,
}: Playtime_ChartDoughnutTiersProps) {
    const timeByTierDoughnutData = useMemo<ChartData<"doughnut">>(() => {
        const timePerTier: number[] = tiers.map((tier) =>
            recordsTopStatistics.finishesPerTier[tier].reduce(
                (acc, finish) => acc + finish.time,
                0,
            ),
        )

        return {
            labels: tierLabels,
            datasets: [
                {
                    label: "Playtime",
                    data: timePerTier,
                    backgroundColor: [
                        "hsl(120, 99%, 62%)",
                        "hsl(90, 99%, 64%)",
                        "hsl(55, 75%, 70%)",
                        "hsl(41, 75%, 56%)",
                        "hsl(0, 99%, 62%)",
                        "hsl(0, 100%, 50%)",
                        "hsl(294, 78%, 54%)",
                    ],
                    borderColor: "hsl(240 10% 3.9%)",
                },
            ],
        }
    }, [recordsTopStatistics])

    const timeByTierDoughnutOptions = useMemo<ChartOptions<"doughnut">>(
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
                        label: (context) => {
                            return `Playtime: ${getTimeString(context.parsed)}`
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
                <CardTitle>Time by tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Doughnut
                    options={timeByTierDoughnutOptions}
                    data={timeByTierDoughnutData}
                    height={350}
                />
            </CardContent>
        </Card>
    )
}

export default Playtime_ChartDoughnutTiers
