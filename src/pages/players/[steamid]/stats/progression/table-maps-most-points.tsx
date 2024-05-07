import { useMemo } from "react"

import { lightFormat } from "date-fns"

import { cn } from "@/lib/utils"
import { getPointsColor, getTierData } from "@/lib/gokz"
import { useLocalSettings, useRunType } from "@/components/localsettings/localsettings-provider"

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

interface Progression_TableMapMostPointsProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Progression_TableMapMostPoints({
    recordsTopStatistics,
    className,
}: Progression_TableMapMostPointsProps) {
    const [localSettings] = useLocalSettings()

    const [runType] = useRunType()

    const mapsWithMostPoints = useMemo<RecordTopStat[]>(() => {
        return [...recordsTopStatistics.finishes[runType]]
            .sort((finishA, finishB) => finishB.points - finishA.points)
            .slice(0, 6)
    }, [recordsTopStatistics, runType])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Maps with most points</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Map</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead className="text-center">Points</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mapsWithMostPoints.map((finish, index) => {
                            const tierData = getTierData(finish.difficulty)
                            const pointsColor = getPointsColor(finish.points)
                            const dateString = lightFormat(
                                finish.created_on,
                                localSettings.dateFormat,
                            )

                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <MapHoverCard
                                            mapId={finish.map_id}
                                            mapName={finish.map_name}
                                            className="h-7 px-0"
                                        />
                                    </TableCell>
                                    <TableCell className={tierData.color}>
                                        {tierData.label}
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

export default Progression_TableMapMostPoints
