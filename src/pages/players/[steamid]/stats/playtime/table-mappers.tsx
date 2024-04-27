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
import { getTimeString } from "@/lib/utils"

interface Playtime_TableMappersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

export interface MapperData {
    mapperName: string
    mapperId: string
    mapperPlaytime: number
}

function Playtime_TableMappers({ recordsTopStatistics, className }: Playtime_TableMappersProps) {
    const mappersData = useMemo<MapperData[]>(() => {
        return Object.entries(recordsTopStatistics.finishesPerMapper)
            .map(([mapperName, finishes]) => {
                const mapperNameIndex = finishes[0].mapperNames.indexOf(mapperName)
                const mapperId = finishes[0].mapperIds[mapperNameIndex]

                const mapperPlaytime = finishes
                    ? finishes.reduce((acc, finish) => {
                          return acc + finish.time
                      }, 0)
                    : 0

                return {
                    mapperName,
                    mapperId,
                    mapperPlaytime,
                }
            })
            .sort((mapperA, mapperB) => mapperB.mapperPlaytime - mapperA.mapperPlaytime)
            .slice(0, 7)
    }, [recordsTopStatistics])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Playtime by mapper</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mapper</TableHead>
                            <TableHead className="text-right">Playtime</TableHead>
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
                                        {getTimeString(mapperData.mapperPlaytime)}
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

export default Playtime_TableMappers
