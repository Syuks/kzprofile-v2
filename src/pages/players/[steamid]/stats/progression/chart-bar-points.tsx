import { useMemo } from "react"

import { useRunType } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics } from "../stats"

import { Bar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Progression_ChartBarPointsProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Progression_ChartBarPoints({
    recordsTopStatistics,
    className,
}: Progression_ChartBarPointsProps) {
    const [runType] = useRunType()

    const pointsBarData = useMemo<ChartData<"bar">>(() => {
        let runsPer100Points = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        recordsTopStatistics.finishes[runType].forEach((finish) => {
            const arrayIndex = Math.min(Math.floor(finish.points / 100), 10)

            runsPer100Points[arrayIndex]++
        })

        return {
            labels: [
                "0s",
                "100s",
                "200s",
                "300s",
                "400s",
                "500s",
                "600s",
                "700s",
                "800s",
                "900s",
                "1000s",
            ],
            datasets: [
                {
                    label: "Runs",
                    data: runsPer100Points,
                    borderRadius: 8,
                    backgroundColor: [
                        "hsla(0, 0%, 100%, 1)",
                        "hsla(0, 0%, 100%, 1)",
                        "hsla(0, 0%, 100%, 1)",
                        "hsla(0, 0%, 100%, 1)",
                        "hsla(0, 0%, 100%, 1)",
                        "hsla(0, 0%, 100%, 1)",
                        "hsla(0, 0%, 100%, 1)",
                        "hsla(90, 99%, 64%, 1)",
                        "hsla(212, 61%, 61%, 1)",
                        "hsla(0, 100%, 50%, 1)",
                        "hsla(41, 75%, 56%, 1)",
                    ],
                },
            ],
        }
    }, [recordsTopStatistics, runType])

    const pointsBarOptions = useMemo<ChartOptions<"bar">>(
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
                <CardTitle>Runs per 100 points</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar options={pointsBarOptions} data={pointsBarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Progression_ChartBarPoints
