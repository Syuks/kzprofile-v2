import { useMemo } from "react"

import { RecordsTopStatistics } from "../stats"

import { Scatter } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Completion_ChartScatterDaysProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Completion_ChartScatterDays({
    recordsTopStatistics,
    className,
}: Completion_ChartScatterDaysProps) {
    const pbsPerDayScatterData = useMemo<ChartData<"scatter">>(() => {
        const pbsPerDay = Object.entries(recordsTopStatistics.finishesPerDay).map(
            ([date, value]) => ({
                x: new Date(date).getTime(),
                y: value.length,
            }),
        )

        return {
            datasets: [
                {
                    label: "PBs",
                    data: pbsPerDay,
                    backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                    borderColor: "hsla(212, 61%, 61%, 1)",
                },
            ],
        }
    }, [recordsTopStatistics])

    const pbsPerDayScatterOptions = useMemo<ChartOptions<"scatter">>(
        () => ({
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
                },
            },
        }),
        [],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>PBs per day</CardTitle>
            </CardHeader>
            <CardContent>
                <Scatter
                    options={pbsPerDayScatterOptions}
                    data={pbsPerDayScatterData}
                    height={350}
                />
            </CardContent>
        </Card>
    )
}

export default Completion_ChartScatterDays
