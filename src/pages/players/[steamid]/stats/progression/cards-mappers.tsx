import { useMemo } from "react"

import { PersonIcon } from "@radix-ui/react-icons"

import { RecordsTopStatistics } from "../stats"

import { MapperLink } from "@/components/maps/mappers-list"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Progression_CardMappersProps {
    recordsTopStatistics: RecordsTopStatistics
}

export interface MapperData {
    mapperName: string
    mapperId: string
    mapperPoints: number
    mapperAveragePoints: number
    mapperMedalsCount: number
}

interface MappersData {
    mapperWithMostPoints: MapperData
    mapperWithFewerPoints: MapperData
    mapperWithBestAveragePoints: MapperData
    mapperWithMostMedals: MapperData
}

function Progression_CardMappers({ recordsTopStatistics }: Progression_CardMappersProps) {
    const mappersData = useMemo<MappersData>(() => {
        const mappersArray: MapperData[] = Object.entries(recordsTopStatistics.finishesPerMapper)
            .map(([mapperName, finishes]) => {
                const mapperNameIndex = finishes[0].mapperNames.indexOf(mapperName)
                const mapperId = finishes[0].mapperIds[mapperNameIndex]

                const mapperPoints = finishes
                    ? finishes.reduce((acc, finish) => {
                          return acc + finish.points
                      }, 0)
                    : 0

                const mapperAveragePoints = mapperPoints / (finishes.length || 1)

                const mapperMedalsCount = finishes.filter((finish) => finish.points >= 800).length

                return {
                    mapperName,
                    mapperId,
                    mapperPoints,
                    mapperAveragePoints,
                    mapperMedalsCount,
                }
            })
            .sort((mapperA, mapperB) => mapperB.mapperPoints - mapperA.mapperPoints)

        const mapperWithBestAveragePoints = [...mappersArray].sort(
            (mapperA, mapperB) => mapperB.mapperAveragePoints - mapperA.mapperAveragePoints,
        )[0]

        const mapperWithMostMedals = [...mappersArray].sort(
            (mapperA, mapperB) => mapperB.mapperMedalsCount - mapperA.mapperMedalsCount,
        )[0]

        return {
            mapperWithMostPoints: mappersArray[0],
            mapperWithFewerPoints: mappersArray.slice(-1)[0],
            mapperWithBestAveragePoints,
            mapperWithMostMedals,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mapper with most points</CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mapperWithMostPoints.mapperName}
                        mapperId={mappersData.mapperWithMostPoints.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {mappersData.mapperWithMostPoints.mapperPoints.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mapper with fewer points</CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mapperWithFewerPoints.mapperName}
                        mapperId={mappersData.mapperWithFewerPoints.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {mappersData.mapperWithFewerPoints.mapperPoints.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mapper with best average</CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mapperWithBestAveragePoints.mapperName}
                        mapperId={mappersData.mapperWithBestAveragePoints.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {mappersData.mapperWithBestAveragePoints.mapperAveragePoints.toFixed(2)}{" "}
                        average
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mapper with most medals</CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mapperWithMostMedals.mapperName}
                        mapperId={mappersData.mapperWithMostMedals.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {mappersData.mapperWithMostMedals.mapperMedalsCount} medals
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Progression_CardMappers
