import { useMemo } from "react"

import { Doughnut } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { useOutletContext } from "react-router-dom"
import { MapLayoutOutletContext } from ".."

import useMapWRs from "@/hooks/TanStackQueries/useMapWRs"
import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Map_ChartDoughnutServersProps {
    className?: string
}

function Map_ChartDoughnutServers({ className }: Map_ChartDoughnutServersProps) {
    const [gameMode] = useGameMode()
    const [runType] = useRunType()
    const { mapName, stage } = useOutletContext<MapLayoutOutletContext>()

    const mapWRs = useMapWRs(mapName, gameMode, stage)

    const wrsPerServerDoughnutData = useMemo<ChartData<"doughnut">>(() => {
        if (!mapWRs.data) {
            return {
                datasets: [],
            }
        }

        let wrsPerServer: Record<string, number> = {}

        for (const wr of mapWRs.data[runType]) {
            wrsPerServer[wr.server_name] = wrsPerServer[wr.server_name] || 0
            wrsPerServer[wr.server_name]++
        }

        return {
            labels: Object.keys(wrsPerServer),
            datasets: [
                {
                    label: "WRs",
                    data: Object.values(wrsPerServer),
                    backgroundColor: "hsla(0, 79%, 61%, 1)",
                },
            ],
        }
    }, [mapWRs.data, runType])

    const wrsPerServerDoughnutOptions = useMemo<ChartOptions<"doughnut">>(
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
                <CardTitle>WRs per server</CardTitle>
            </CardHeader>
            <CardContent>
                <Doughnut
                    options={wrsPerServerDoughnutOptions}
                    data={wrsPerServerDoughnutData}
                    height={350}
                />
            </CardContent>
        </Card>
    )
}

export default Map_ChartDoughnutServers
