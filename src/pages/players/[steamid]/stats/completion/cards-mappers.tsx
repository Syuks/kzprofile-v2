import { useMemo } from "react"

import { PersonIcon } from "@radix-ui/react-icons"

import { RecordsTopStatistics } from "../stats"

import { MapperLink } from "@/components/maps/mappers-list"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Completion_CardMappersProps {
    recordsTopStatistics: RecordsTopStatistics
}

export interface MapperData {
    mapperName: string
    mapperId: string
    mapperMapsCount: number
    mapperFinishesCount: number
    mapperUnfinishesCount: number
    mapperCompletionPercentage: number
}

interface MappersData {
    mapperWithMostFinishes: MapperData
    mapperWithMostUnfinishes: MapperData
    mostCompletedMapper: MapperData
    mostIncompletedMapper: MapperData
}

function Completion_CardMappers({ recordsTopStatistics }: Completion_CardMappersProps) {
    const mappersData = useMemo<MappersData>(() => {
        const mappersArray: MapperData[] = Object.keys(recordsTopStatistics.mapsPerMapper)
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
            .sort((mapperA, mapperB) => mapperB.mapperMapsCount - mapperA.mapperMapsCount)

        const mapperWithMostFinishes = [...mappersArray].sort((mapperA, mapperB) => {
            return mapperB.mapperFinishesCount - mapperA.mapperFinishesCount
        })[0]

        const mapperWithMostUnfinishes = [...mappersArray].sort((mapperA, mapperB) => {
            return mapperB.mapperUnfinishesCount - mapperA.mapperUnfinishesCount
        })[0]

        const mappersSortedByCompletion = [...mappersArray].sort(
            (mapperA, mapperB) =>
                mapperB.mapperCompletionPercentage - mapperA.mapperCompletionPercentage,
        )

        const mostCompletedMapper = mappersSortedByCompletion[0]

        const leastCompletionPercenetage =
            mappersSortedByCompletion.slice(-1)[0].mapperCompletionPercentage
        const mappersWithLeastCompletion = mappersSortedByCompletion.filter(
            (mapperData) => mapperData.mapperCompletionPercentage === leastCompletionPercenetage,
        )
        const mostIncompletedMapper = mappersWithLeastCompletion[0]

        return {
            mapperWithMostFinishes,
            mapperWithMostUnfinishes,
            mostCompletedMapper,
            mostIncompletedMapper,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mapper with most finishes</CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mapperWithMostFinishes.mapperName}
                        mapperId={mappersData.mapperWithMostFinishes.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {mappersData.mapperWithMostFinishes.mapperFinishesCount} maps of{" "}
                        {mappersData.mapperWithMostFinishes.mapperMapsCount}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Mapper with most unfinishes
                    </CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mapperWithMostUnfinishes.mapperName}
                        mapperId={mappersData.mapperWithMostUnfinishes.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {mappersData.mapperWithMostUnfinishes.mapperUnfinishesCount} maps of{" "}
                        {mappersData.mapperWithMostUnfinishes.mapperMapsCount}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Most completed mapper</CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mostCompletedMapper.mapperName}
                        mapperId={mappersData.mostCompletedMapper.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {mappersData.mostCompletedMapper.mapperCompletionPercentage.toFixed(3)} % (
                        {mappersData.mostCompletedMapper.mapperFinishesCount} /{" "}
                        {mappersData.mostCompletedMapper.mapperMapsCount})
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Most incompleted mapper</CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <MapperLink
                        mapperName={mappersData.mostIncompletedMapper.mapperName}
                        mapperId={mappersData.mostIncompletedMapper.mapperId}
                        className="truncate text-2xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">
                        {mappersData.mostIncompletedMapper.mapperCompletionPercentage.toFixed(3)} %
                        ({mappersData.mostIncompletedMapper.mapperFinishesCount} /{" "}
                        {mappersData.mostIncompletedMapper.mapperMapsCount})
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Completion_CardMappers
