import { useMemo } from "react"

import { lightFormat } from "date-fns"

import { cn } from "@/lib/utils"
import { getPointsColor, getTierData, tiers } from "@/lib/gokz"
import { useLocalSettings } from "@/components/localsettings/localsettings-provider"

import { RecordsTopStatistics, RecordTopStat } from "../stats"

import MapHoverCard from "@/components/maps/map-hover-card"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Completion_TableLastFinishProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Completion_TableLastFinish({
    recordsTopStatistics,
    className,
}: Completion_TableLastFinishProps) {
    const [localSettings] = useLocalSettings()

    const lastFinishPerTier = useMemo<RecordTopStat[]>(() => {
        let finishes_per_tier = []

        for (const tierId of tiers) {
            const finishes = recordsTopStatistics.finishesPerTier[tierId]

            if (!finishes.length) {
                continue
            }

            finishes_per_tier.push(
                finishes.reduce((max, finish) => {
                    return new Date(finish.created_on) > new Date(max.created_on) ? finish : max
                }),
            )
        }

        return finishes_per_tier
    }, [recordsTopStatistics])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Last finish per tier</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tier</TableHead>
                            <TableHead>Map</TableHead>
                            <TableHead className="text-center">Points</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lastFinishPerTier.map((finish, index) => {
                            const tierData = getTierData(finish.difficulty)
                            const pointsColor = getPointsColor(finish.points)
                            const dateString = lightFormat(
                                finish.created_on,
                                localSettings.dateFormat,
                            )

                            return (
                                <TableRow key={index}>
                                    <TableCell className={tierData.color}>
                                        {tierData.label}
                                    </TableCell>
                                    <TableCell>
                                        <MapHoverCard
                                            mapName={finish.map_name}
                                            className="h-7 px-0"
                                        />
                                    </TableCell>
                                    <TableCell className={cn("text-center", pointsColor)}>
                                        {finish.points}
                                    </TableCell>
                                    <TableCell className="text-right">{dateString}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default Completion_TableLastFinish
