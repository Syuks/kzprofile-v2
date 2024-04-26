import { useMemo } from "react"

import { TierID, tiers } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Bar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Completion_ChartBarServersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Completion_ChartBarServers({
    recordsTopStatistics,
    className,
}: Completion_ChartBarServersProps) {
    const serversBarData = useMemo<ChartData<"bar">>(() => {
        const serverArray = Object.entries(recordsTopStatistics.finishesPerServer).map(
            ([serverName, finishes]) => ({
                serverName: serverName.substring(0, 15),
                1: finishes.filter((finish) => finish.difficulty === 1).length,
                2: finishes.filter((finish) => finish.difficulty === 2).length,
                3: finishes.filter((finish) => finish.difficulty === 3).length,
                4: finishes.filter((finish) => finish.difficulty === 4).length,
                5: finishes.filter((finish) => finish.difficulty === 5).length,
                6: finishes.filter((finish) => finish.difficulty === 6).length,
                7: finishes.filter((finish) => finish.difficulty === 7).length,
            }),
        )

        const getMostFinishesServer = (tierId: TierID) =>
            [...serverArray].sort((a, b) => b[tierId] - a[tierId])[0]

        const serverLabels = tiers.map((tierId) => getMostFinishesServer(tierId).serverName)

        const serverData = tiers.map((tierId) => getMostFinishesServer(tierId)[tierId])

        return {
            labels: serverLabels,
            datasets: [
                {
                    data: serverData,
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

    const serversBarOptions = useMemo<ChartOptions<"bar">>(
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
                <CardTitle>Server with most PBs per tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar options={serversBarOptions} data={serversBarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Completion_ChartBarServers
