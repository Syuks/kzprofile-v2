import { useMemo } from "react"

import { Doughnut } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { useOutletContext } from "react-router-dom"
import { MapLayoutOutletContext } from ".."

import useMapWRs from "@/hooks/TanStackQueries/useMapWRs"
import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Map_ChartDoughnutPlayersProps {
    className?: string
}

function Map_ChartDoughnutPlayers({ className }: Map_ChartDoughnutPlayersProps) {
    const [gameMode] = useGameMode()
    const [runType] = useRunType()
    const { mapName, stage } = useOutletContext<MapLayoutOutletContext>()

    const mapWRs = useMapWRs(mapName, gameMode, stage)

    const wrsPerPlayerDoughnutData = useMemo<ChartData<"doughnut">>(() => {
        if (!mapWRs.data) {
            return {
                datasets: [],
            }
        }

        let wrsPerPlayer: Record<string, number> = {}

        for (const wr of mapWRs.data[runType]) {
            wrsPerPlayer[wr.player_name] = wrsPerPlayer[wr.player_name] || 0
            wrsPerPlayer[wr.player_name]++
        }

        return {
            labels: Object.keys(wrsPerPlayer),
            datasets: [
                {
                    label: "WRs",
                    data: Object.values(wrsPerPlayer),
                    backgroundColor: "hsla(212, 61%, 61%, 1)",
                },
            ],
        }
    }, [mapWRs.data, runType])

    const wrsPerPlayerDoughnutOptions = useMemo<ChartOptions<"doughnut">>(
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
                <CardTitle>WRs per player</CardTitle>
            </CardHeader>
            <CardContent>
                <Doughnut
                    options={wrsPerPlayerDoughnutOptions}
                    data={wrsPerPlayerDoughnutData}
                    height={350}
                />
            </CardContent>
        </Card>
    )
}

export default Map_ChartDoughnutPlayers
