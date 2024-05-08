import { useMemo } from "react"

import { RecordsTopStatistics } from "../stats"

import { MapperLink } from "@/components/maps/mappers-list"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Progression_TableMappersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

export interface MapperData {
    mapperName: string
    mapperId: string
    mapperPoints: number
}

function Progression_TableMappers({
    recordsTopStatistics,
    className,
}: Progression_TableMappersProps) {
    const mappersData = useMemo<MapperData[]>(() => {
        return Object.entries(recordsTopStatistics.finishesPerMapper)
            .map(([mapperName, finishes]) => {
                const mapperNameIndex = finishes[0].mapperNames.indexOf(mapperName)
                const mapperId = finishes[0].mapperIds[mapperNameIndex]

                const mapperPoints = finishes
                    ? finishes.reduce((acc, finish) => {
                          return acc + finish.points
                      }, 0)
                    : 0

                return {
                    mapperName,
                    mapperId,
                    mapperPoints,
                }
            })
            .sort((mapperA, mapperB) => mapperB.mapperPoints - mapperA.mapperPoints)
            .slice(0, 7)
    }, [recordsTopStatistics])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Points by mapper</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mapper</TableHead>
                            <TableHead className="text-right">Points</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mappersData.map((mapperData, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>
                                        <MapperLink
                                            mapperName={mapperData.mapperName}
                                            mapperId={mapperData.mapperId}
                                            className="h-7"
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {mapperData.mapperPoints.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default Progression_TableMappers
