import { useMemo } from "react"

import { TierID, tiers } from "@/lib/gokz"
import { getTimeString } from "@/lib/utils"

import { RecordsTopStatistics } from "../stats"

import { Bar } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Playtime_ChartBarMappersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Playtime_ChartBarMappers({
    recordsTopStatistics,
    className,
}: Playtime_ChartBarMappersProps) {
    const mappersBarData = useMemo<ChartData<"bar">>(() => {
        const mapperArray = Object.entries(recordsTopStatistics.finishesPerMapper).map(
            ([mapperName, finishes]) => {
                const getTierPlaytime = (tierId: TierID): number => {
                    const tierFinishes = finishes.filter((finish) => finish.difficulty === tierId)

                    if (!tierFinishes.length) {
                        return 0
                    }

                    return tierFinishes.reduce((acc, finish) => acc + finish.time, 0)
                }

                return {
                    mapperName,
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

        const getMapperWithMostPlaytime = (tierId: TierID) =>
            [...mapperArray].sort((a, b) => b[tierId] - a[tierId])[0]

        const mapperLabels = tiers.map((tierId) => getMapperWithMostPlaytime(tierId).mapperName)

        const mapperData = tiers.map((tierId) => getMapperWithMostPlaytime(tierId)[tierId])

        return {
            labels: mapperLabels,
            datasets: [
                {
                    data: mapperData,
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

    const mappersBarOptions = useMemo<ChartOptions<"bar">>(
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
                <CardTitle>Mapper with most playtime per tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar options={mappersBarOptions} data={mappersBarData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Playtime_ChartBarMappers
