import { useMemo } from "react"

import { PersonIcon } from "@radix-ui/react-icons"

import { getTimeString } from "@/lib/utils"

import { RecordsTopStatistics } from "../stats"

import { MapperLink } from "@/components/maps/mappers-list"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Playtime_CardMappersProps {
    recordsTopStatistics: RecordsTopStatistics
}

export interface MapperData {
    mapperName: string
    mapperId: string
    mapperPlaytime: number
    mapperShortRunsCount: number
    mapperLongRunsCount: number
}

interface MappersData {
    mapperWithMostPlaytime: MapperData
    mapperWithLeastPlaytime: MapperData
    mapperWithMostShortRuns: MapperData
    mapperWithMostLongRuns: MapperData
}

function Playtime_CardMappers({ recordsTopStatistics }: Playtime_CardMappersProps) {
    const mappersData = useMemo<MappersData>(() => {
        const mappersArray: MapperData[] = Object.entries(recordsTopStatistics.finishesPerMapper)
            .map(([mapperName, finishes]) => {
                const mapperNameIndex = finishes[0].mapperNames.indexOf(mapperName)
                const mapperId = finishes[0].mapperIds[mapperNameIndex]

                const mapperPlaytime = finishes
                    ? finishes.reduce((acc, finish) => {
                          return acc + finish.time
                      }, 0)
                    : 0

                const mapperShortRunsCount = finishes.filter((finish) => finish.time < 120).length

                const mapperLongRunsCount = finishes.filter((finish) => finish.time > 120).length

                return {
                    mapperName,
                    mapperId,
                    mapperPlaytime,
                    mapperShortRunsCount,
                    mapperLongRunsCount,
                }
            })
            .sort((mapperA, mapperB) => mapperB.mapperPlaytime - mapperA.mapperPlaytime)

        const mapperWithMostShortRuns = [...mappersArray].sort(
            (mapperA, mapperB) => mapperB.mapperShortRunsCount - mapperA.mapperShortRunsCount,
        )[0]

        const mapperWithMostLongRuns = [...mappersArray].sort(
            (mapperA, mapperB) => mapperB.mapperLongRunsCount - mapperA.mapperLongRunsCount,
        )[0]

        return {
            mapperWithMostPlaytime: mappersArray[0],
            mapperWithLeastPlaytime: mappersArray.slice(-1)[0],
            mapperWithMostShortRuns,
            mapperWithMostLongRuns,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mapper with most playtime</CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mapperWithMostPlaytime.mapperName}
                        mapperId={mappersData.mapperWithMostPlaytime.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {getTimeString(mappersData.mapperWithMostPlaytime.mapperPlaytime)}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Mapper with least playtime
                    </CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mapperWithLeastPlaytime.mapperName}
                        mapperId={mappersData.mapperWithLeastPlaytime.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {getTimeString(mappersData.mapperWithLeastPlaytime.mapperPlaytime)}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Mapper with most short runs
                    </CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mapperWithMostShortRuns.mapperName}
                        mapperId={mappersData.mapperWithMostShortRuns.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {mappersData.mapperWithMostShortRuns.mapperShortRunsCount} runs under 2
                        minutes
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Mapper with most long runs
                    </CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mapperWithMostLongRuns.mapperName}
                        mapperId={mappersData.mapperWithMostLongRuns.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {mappersData.mapperWithMostLongRuns.mapperLongRunsCount} runs over 2 minutes
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Playtime_CardMappers
