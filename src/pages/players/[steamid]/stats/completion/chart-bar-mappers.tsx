import { useMemo } from "react"

import { TierID, tiers } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Bar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Completion_ChartBarMappersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Completion_ChartBarMappers({
    recordsTopStatistics,
    className,
}: Completion_ChartBarMappersProps) {
    const mappersBarData = useMemo<ChartData<"bar">>(() => {
        const mapperArray = Object.entries(recordsTopStatistics.finishesPerMapper).map(
            ([mapperName, finishes]) => ({
                mapperName,
                1: finishes.filter((finish) => finish.difficulty === 1).length,
                2: finishes.filter((finish) => finish.difficulty === 2).length,
                3: finishes.filter((finish) => finish.difficulty === 3).length,
                4: finishes.filter((finish) => finish.difficulty === 4).length,
                5: finishes.filter((finish) => finish.difficulty === 5).length,
                6: finishes.filter((finish) => finish.difficulty === 6).length,
                7: finishes.filter((finish) => finish.difficulty === 7).length,
            }),
        )

        const getMostFinishesMapper = (tierId: TierID) =>
            [...mapperArray].sort((a, b) => b[tierId] - a[tierId])[0]

        const mapperLabels = tiers.map((tierId) => getMostFinishesMapper(tierId).mapperName)

        const mapperData = tiers.map((tierId) => getMostFinishesMapper(tierId)[tierId])

        return {
            labels: mapperLabels,
            datasets: [
                {
                    data: mapperData,
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

    const mappersBarOptions = useMemo<ChartOptions<"bar">>(
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
                <CardTitle>Mapper with most finishes per tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar options={mappersBarOptions} data={mappersBarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Completion_ChartBarMappers
