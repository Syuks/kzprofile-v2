import { useMemo } from "react"

import { useOutletContext } from "react-router-dom"

import { Line } from "react-chartjs-2"
import type { ChartConfiguration } from "chart.js"

import { MapLayoutOutletContext } from ".."
import { getTimeString } from "@/lib/utils"
import useMapWRs, { type RecordsTopRecent } from "@/hooks/TanStackQueries/useMapWRs"
import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Map_ChartLineWrHistoryProps {
    className?: string
}

interface RecordsTopRecentMilliseconds extends RecordsTopRecent {
    created_on_time: number
}

function Map_ChartLineWrHistory({ className }: Map_ChartLineWrHistoryProps) {
    const [gameMode] = useGameMode()
    const [runType] = useRunType()
    const { mapName, stage } = useOutletContext<MapLayoutOutletContext>()

    const mapWRs = useMapWRs(mapName, gameMode, stage)

    const wrHistoryLineConfiguration = useMemo<
        ChartConfiguration<"line", RecordsTopRecentMilliseconds[]>
    >(() => {
        if (!mapWRs.data) {
            return {
                type: "line",
                data: {
                    datasets: [],
                },
                options: { responsive: true, maintainAspectRatio: false },
            }
        }

        let recordsChartData = mapWRs.data[runType].map((record) => {
            return { ...record, created_on_time: new Date(record.created_on).getTime() }
        })

        recordsChartData.unshift({
            ...mapWRs.data[runType][0],
            player_name: "Still standing",
            created_on_time: new Date().getTime(),
        })

        return {
            type: "line",
            data: {
                datasets: [
                    {
                        label: "Time",
                        data: recordsChartData,
                        parsing: {
                            xAxisKey: "created_on_time",
                            yAxisKey: "time",
                        },
                        stepped: "after",
                        backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                        borderColor: "hsla(212, 61%, 61%, 1)",
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: "time",
                    },
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
                            beforeTitle: (context) =>
                                recordsChartData[context[0].dataIndex].player_name,
                            label: (context) => {
                                return `${recordsChartData[context.dataIndex].teleports === 0 ? "PRO" : "TP"}: ${getTimeString(context.parsed.y)}`
                            },
                        },
                    },
                },
            },
        }
    }, [mapWRs.data, runType])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>WR History</CardTitle>
            </CardHeader>
            <CardContent>
                <Line
                    options={wrHistoryLineConfiguration.options}
                    data={wrHistoryLineConfiguration.data}
                    height={350}
                />
            </CardContent>
        </Card>
    )
}

export default Map_ChartLineWrHistory
