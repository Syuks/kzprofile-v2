import { useMemo } from "react"

import { TierID, tiers } from "@/lib/gokz"
import { getTimeString } from "@/lib/utils"

import { RecordsTopStatistics } from "../stats"

import { Bar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Playtime_ChartBarServersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Playtime_ChartBarServers({
    recordsTopStatistics,
    className,
}: Playtime_ChartBarServersProps) {
    const serversBarData = useMemo<ChartData<"bar">>(() => {
        const serverArray = Object.entries(recordsTopStatistics.finishesPerServer).map(
            ([serverName, finishes]) => {
                const getTierPlaytime = (tierId: TierID): number => {
                    const tierFinishes = finishes.filter((finish) => finish.difficulty === tierId)

                    if (!tierFinishes.length) {
                        return 0
                    }

                    return tierFinishes.reduce((acc, finish) => acc + finish.time, 0)
                }

                return {
                    serverName: serverName.substring(0, 15),
                    1: getTierPlaytime(1),
                    2: getTierPlaytime(2),
                    3: getTierPlaytime(3),
                    4: getTierPlaytime(4),
                    5: getTierPlaytime(5),
                    6: getTierPlaytime(6),
                    7: getTierPlaytime(7),
                }
            },
        )

        const getserverWithMostPlaytime = (tierId: TierID) =>
            [...serverArray].sort((a, b) => b[tierId] - a[tierId])[0]

        const serverLabels = tiers.map((tierId) => getserverWithMostPlaytime(tierId).serverName)

        const serverData = tiers.map((tierId) => getserverWithMostPlaytime(tierId)[tierId])

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
            scales: {
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
                        label: (context) => {
                            return `Playtime: ${getTimeString(context.parsed.y)}`
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
                <CardTitle>Server with most playtime per tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar options={serversBarOptions} data={serversBarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Playtime_ChartBarServers
