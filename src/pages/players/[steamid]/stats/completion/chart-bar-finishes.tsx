import { useMemo } from "react"

import { tierLabels, tiers } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Bar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Completion_ChartBarFinishesProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Completion_ChartBarFinishes({
    recordsTopStatistics,
    className,
}: Completion_ChartBarFinishesProps) {
    const finishesBarData = useMemo<ChartData<"bar">>(() => {
        const finishesPerTier: number[] = tiers.map(
            (tier) => recordsTopStatistics.finishesPerTier[tier].length,
        )

        return {
            labels: tierLabels,
            datasets: [
                {
                    label: "Finishes",
                    data: finishesPerTier,
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

    const finishesBarOptions = useMemo<ChartOptions<"bar">>(
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
                },
            },
        }),
        [],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Finishes per tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar options={finishesBarOptions} data={finishesBarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Completion_ChartBarFinishes
