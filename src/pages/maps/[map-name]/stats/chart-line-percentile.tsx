import { useMemo } from "react"

import { Line } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { useOutletContext } from "react-router-dom"
import { MapLayoutOutletContext } from ".."

import { getTimeString } from "@/lib/utils"
import useMapDistributions from "@/hooks/TanStackQueries/useMapDistributions"
import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Map_ChartLinePercentileProps {
    className?: string
}

function Map_ChartLinePercentile({ className }: Map_ChartLinePercentileProps) {
    const [gameMode] = useGameMode()
    const [runType] = useRunType()
    const { kzProfileMap, stage } = useOutletContext<MapLayoutOutletContext>()

    const mapPointsDistribution = useMapDistributions(kzProfileMap?.id, gameMode, stage)

    const percentileLineData = useMemo<ChartData<"line">>(() => {
        if (!mapPointsDistribution.data) {
            return {
                datasets: [],
            }
        }

        // There is no NUB data for points distribution
        const data =
            runType === "pro"
                ? mapPointsDistribution.data.pro.percentile
                : mapPointsDistribution.data.tp.percentile

        return {
            datasets: [
                {
                    label: runType === "pro" ? "PRO" : "TP",
                    data,
                    pointRadius: 0,
                    pointHitRadius: 1,
                    backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                    borderColor: "hsla(212, 61%, 61%, 1)",
                },
            ],
        }
    }, [mapPointsDistribution.data, runType])

    const percentileLineOptions = useMemo<ChartOptions<"line">>(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: "time",
                    ticks: {
                        autoSkip: true,
                        callback: (_value, index) => getTimeString(index),
                    },
                },
            },
            fill: true,
            cubicInterpolationMode: "monotone",
            animation: false,
            parsing: false,
            interaction: {
                mode: "nearest",
                axis: "x",
                intersect: false,
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
                        title: (context) => `Time: ${getTimeString(context[0].parsed.x)}`,
                        label: (context) =>
                            `${context.dataset.label}: Top ${Math.ceil((1 - context.parsed.y) * 100)} %`,
                    },
                },
            },
        }),
        [],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Average percentile</CardTitle>
            </CardHeader>
            <CardContent>
                <Line options={percentileLineOptions} data={percentileLineData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Map_ChartLinePercentile
