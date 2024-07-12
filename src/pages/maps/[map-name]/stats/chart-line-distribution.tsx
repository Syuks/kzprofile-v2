import { useMemo } from "react"

import { Line } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { useOutletContext } from "react-router-dom"
import { MapLayoutOutletContext } from ".."

import { getTimeString } from "@/lib/utils"
import useMapDistributions from "@/hooks/TanStackQueries/useMapDistributions"
import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Map_ChartLineDistributionProps {
    className?: string
}

function Map_ChartLineDistribution({ className }: Map_ChartLineDistributionProps) {
    const [gameMode] = useGameMode()
    const [runType] = useRunType()
    const { kzProfileMap, stage } = useOutletContext<MapLayoutOutletContext>()

    const mapPointsDistribution = useMapDistributions(kzProfileMap?.id, gameMode, stage)

    const distributionLineData = useMemo<ChartData<"line">>(() => {
        if (!mapPointsDistribution.data) {
            return {
                datasets: [],
            }
        }

        // There is no NUB data for points distribution
        const data =
            runType === "pro"
                ? mapPointsDistribution.data.pro.distribution
                : mapPointsDistribution.data.tp.distribution

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

    const distributionLineOptions = useMemo<ChartOptions<"line">>(
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
                        label: (context) => {
                            const raw = context.raw as { x: number; y: number; percentile: number }
                            return `${context.dataset.label}: Top ${Math.ceil((1 - raw.percentile) * 100)} %`
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
                <CardTitle>Average distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <Line options={distributionLineOptions} data={distributionLineData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Map_ChartLineDistribution
