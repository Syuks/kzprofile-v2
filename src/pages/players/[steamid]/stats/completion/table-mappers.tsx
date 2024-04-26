import { useMemo } from "react"

import { RecordsTopStatistics } from "../stats"

import type { MapperData } from "./cards-mappers"

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

interface Completion_TableMappersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Completion_TableMappers({
    recordsTopStatistics,
    className,
}: Completion_TableMappersProps) {
    const mappersData = useMemo<MapperData[]>(() => {
        return Object.keys(recordsTopStatistics.mapsPerMapper)
            .map((mapperName) => {
                const mapperNameIndex =
                    recordsTopStatistics.mapsPerMapper[mapperName][0].mapperNames.indexOf(
                        mapperName,
                    )
                const mapperId =
                    recordsTopStatistics.mapsPerMapper[mapperName][0].mapperIds[mapperNameIndex]
                const mapperMapsCount = recordsTopStatistics.mapsPerMapper[mapperName].length
                const mapperFinishesCount =
                    recordsTopStatistics.finishesPerMapper[mapperName]?.length || 0
                const mapperUnfinishesCount =
                    recordsTopStatistics.unfinishesPerMapper[mapperName]?.length || 0
                const mapperCompletionPercentage = (mapperFinishesCount / mapperMapsCount) * 100

                return {
                    mapperName,
                    mapperId,
                    mapperMapsCount,
                    mapperFinishesCount,
                    mapperUnfinishesCount,
                    mapperCompletionPercentage,
                }
            })
            .sort((mapperA, mapperB) => mapperB.mapperFinishesCount - mapperA.mapperFinishesCount)
            .slice(0, 7)
    }, [recordsTopStatistics])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Finishes by mapper</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mapper</TableHead>
                            <TableHead className="text-center">Finishes</TableHead>
                            <TableHead className="text-center">Unfinishes</TableHead>
                            <TableHead className="text-right">Completion</TableHead>
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
                                    <TableCell className="text-center">
                                        {mapperData.mapperFinishesCount}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {mapperData.mapperUnfinishesCount}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {mapperData.mapperCompletionPercentage.toFixed(3)} %
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

export default Completion_TableMappers
