import { useMemo } from "react"

import { format } from "date-fns"

import { KZRank, getKZRank } from "@/lib/gokz"
import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics } from "../stats"

import { Line } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Progression_ChartLineRankProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Progression_ChartLineRank({
    recordsTopStatistics,
    className,
}: Progression_ChartLineRankProps) {
    const [runType] = useRunType()
    const [gameMode] = useGameMode()

    const rankLineData = useMemo<ChartData<"line">>(() => {
        let acc = 0
        let lastRank: KZRank = getKZRank(gameMode, 0)
        let ranks: { x: number; y: number }[] = [
            {
                x: new Date("2018-01-09").getTime(),
                y: 0,
            },
        ]

        const allFinishes = recordsTopStatistics.finishes.pro
            .concat(recordsTopStatistics.finishes.tp)
            .sort(
                (finishA, finishB) =>
                    new Date(finishA.created_on).getTime() - new Date(finishB.created_on).getTime(),
            )

        for (const finish of allFinishes) {
            acc += finish.points
            const rank = getKZRank(gameMode, acc)

            if (rank.label !== lastRank.label) {
                lastRank = rank
                ranks.push({
                    x: new Date(finish.created_on).getTime(),
                    y: rank.prevThreshold,
                })
            }
        }

        ranks.push({
            x: new Date().getTime(),
            y: lastRank.prevThreshold,
        })

        return {
            datasets: [
                {
                    label: "Rank",
                    data: ranks,
                    stepped: true,
                    backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                    borderColor: "hsla(212, 61%, 61%, 1)",
                },
            ],
        }
    }, [recordsTopStatistics, runType, gameMode])

    const rankLineOptions = useMemo<ChartOptions<"line">>(
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
            interaction: {
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
                        title: (context) => format(context[0].parsed.x, "MMM do, yyyy"),
                        label: (context) => `Rank: ${getKZRank(gameMode, context.parsed.y).label}`,
                    },
                },
            },
        }),
        [gameMode],
    )

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Rank progression</CardTitle>
            </CardHeader>
            <CardContent>
                <Line options={rankLineOptions} data={rankLineData} height={350} />
            </CardContent>
        </Card>
    )
}

export default Progression_ChartLineRank
