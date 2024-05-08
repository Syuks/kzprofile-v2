import { useMemo } from "react"

import { TierID, tiers } from "@/lib/gokz"

import { RecordsTopStatistics } from "../stats"

import { Bar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Progression_ChartBarServersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Progression_ChartBarServers({
    recordsTopStatistics,
    className,
}: Progression_ChartBarServersProps) {
    const serversBarData = useMemo<ChartData<"bar">>(() => {
        const serverArray = Object.entries(recordsTopStatistics.finishesPerServer).map(
            ([serverName, finishes]) => {
                const getTierPoints = (tierId: TierID): number => {
                    const tierFinishes = finishes.filter((finish) => finish.difficulty === tierId)

                    if (!tierFinishes.length) {
                        return 0
                    }

                    return tierFinishes.reduce((acc, finish) => acc + finish.points, 0)
                }

                return {
                    serverName: serverName.substring(0, 15),
                    1: getTierPoints(1),
                    2: getTierPoints(2),
                    3: getTierPoints(3),
                    4: getTierPoints(4),
                    5: getTierPoints(5),
                    6: getTierPoints(6),
                    7: getTierPoints(7),
                }
            },
        )

        const getserverWithMostPoints = (tierId: TierID) =>
            [...serverArray].sort((a, b) => b[tierId] - a[tierId])[0]

        const serverLabels = tiers.map((tierId) => getserverWithMostPoints(tierId).serverName)

        const serverData = tiers.map((tierId) => getserverWithMostPoints(tierId)[tierId])

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
                    callbacks: {
                        label: (context) => {
                            return `Points: ${context.parsed.y.toLocaleString()}`
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
                <CardTitle>Server with most points per tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar options={serversBarOptions} data={serversBarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Progression_ChartBarServers
