import { useMemo } from "react"

import { CalendarIcon, LightningBoltIcon } from "@radix-ui/react-icons"

import { useOutletContext } from "react-router-dom"
import { MapLayoutOutletContext } from ".."

import { differenceInDays, format, millisecondsToMinutes } from "date-fns"

import { getTimeString } from "@/lib/utils"
import useMapWRs, { type RecordsTopRecent } from "@/hooks/TanStackQueries/useMapWRs"
import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { MapperLink } from "@/components/maps/mappers-list"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface WRsData {
    currentWR: {
        player: string
        steamid: string
        time: string
        date: string
    }
    firstClear: {
        player: string
        steamid: string
        time: string
        date: string
    }
    longestStanding: {
        player: string
        steamid: string
        time: string
        duration: string
    }
    fastestRetake: {
        player: string
        steamid: string
        time: string
        duration: string
    }
}

function Map_CardWRs() {
    const [gameMode] = useGameMode()
    const [runType] = useRunType()
    const { mapName, stage } = useOutletContext<MapLayoutOutletContext>()

    const mapWRs = useMapWRs(mapName, gameMode, stage)

    const wrsData = useMemo<WRsData | undefined>(() => {
        if (!mapWRs.data || !mapWRs.data[runType].length) {
            return undefined
        }

        const currentWR: RecordsTopRecent = mapWRs.data[runType][0]
        const firstClear: RecordsTopRecent = mapWRs.data[runType][mapWRs.data[runType].length - 1]

        const stillStandingRecord = {
            ...mapWRs.data[runType][0],
            player_name: "Still standing",
            created_on: new Date().toLocaleString(),
        }

        const longestStanding = mapWRs.data[runType].reduce(
            (acc, curr) => {
                const timeDistance =
                    new Date(acc.previousIterationRecord.created_on).getTime() -
                    new Date(curr.created_on).getTime()

                if (timeDistance >= acc.duration) {
                    return {
                        previousIterationRecord: { ...curr },
                        longestStandingRecord: { ...curr },
                        duration: timeDistance,
                    }
                }

                return {
                    ...acc,
                    previousIterationRecord: { ...curr },
                }
            },
            {
                previousIterationRecord: stillStandingRecord,
                longestStandingRecord: stillStandingRecord,
                duration: 0,
            },
        )

        const fastestRetake = mapWRs.data[runType].reduce(
            (acc, curr) => {
                const timeDistance =
                    new Date(acc.previousIterationRecord.created_on).getTime() -
                    new Date(curr.created_on).getTime()

                if (timeDistance <= acc.duration) {
                    return {
                        previousIterationRecord: { ...curr },
                        fastestRetakeRecord: { ...curr },
                        duration: timeDistance,
                    }
                }
                return {
                    ...acc,
                    previousIterationRecord: { ...curr },
                }
            },
            {
                previousIterationRecord: stillStandingRecord,
                fastestRetakeRecord: stillStandingRecord,
                duration: new Date().getTime(),
            },
        )

        const customDuration = (milliseconds: number) => {
            const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000

            if (milliseconds < MILLISECONDS_IN_A_DAY) {
                return `${millisecondsToMinutes(milliseconds)} minutes`
            }

            return `${differenceInDays(new Date(milliseconds), new Date(0))} days`
        }

        return {
            currentWR: {
                player: currentWR.player_name,
                steamid: currentWR.steamid64,
                time: getTimeString(currentWR.time),
                date: format(currentWR.created_on, "MMM do, yyyy"),
            },
            firstClear: {
                player: firstClear.player_name,
                steamid: firstClear.steamid64,
                time: getTimeString(firstClear.time),
                date: format(firstClear.created_on, "MMM do, yyyy"),
            },
            longestStanding: {
                player: longestStanding.longestStandingRecord.player_name,
                steamid: longestStanding.longestStandingRecord.steamid64,
                time: getTimeString(longestStanding.longestStandingRecord.time),
                duration: customDuration(longestStanding.duration),
            },
            fastestRetake: {
                player: fastestRetake.fastestRetakeRecord.player_name,
                steamid: fastestRetake.fastestRetakeRecord.steamid64,
                time: getTimeString(fastestRetake.fastestRetakeRecord.time),
                duration: customDuration(fastestRetake.duration),
            },
        }
    }, [mapWRs.data, runType])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current WR</CardTitle>
                    <div className="text-sm text-muted-foreground">1°</div>
                </CardHeader>
                <CardContent>
                    {wrsData && (
                        <>
                            <MapperLink
                                mapperName={wrsData.currentWR.player}
                                mapperId={wrsData.currentWR.steamid}
                                className="truncate text-2xl font-bold"
                            />
                            <p className="text-xs text-muted-foreground">
                                {wrsData.currentWR.time} on {wrsData.currentWR.date}
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">First clear</CardTitle>
                    <div className="text-sm text-muted-foreground">1st</div>
                </CardHeader>
                <CardContent>
                    {wrsData && (
                        <>
                            <MapperLink
                                mapperName={wrsData.firstClear.player}
                                mapperId={wrsData.firstClear.steamid}
                                className="truncate text-2xl font-bold"
                            />
                            <p className="text-xs text-muted-foreground">
                                {wrsData.firstClear.time} on {wrsData.firstClear.date}
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Longest standing WR</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {wrsData && (
                        <>
                            <div className="truncate text-2xl font-bold">
                                {wrsData.longestStanding.duration}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {wrsData.longestStanding.time} by{" "}
                                <MapperLink
                                    mapperName={wrsData.longestStanding.player}
                                    mapperId={wrsData.longestStanding.steamid}
                                />
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fastest retake</CardTitle>
                    <LightningBoltIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {wrsData && (
                        <>
                            <div className="truncate text-2xl font-bold">
                                {wrsData.fastestRetake.duration}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {wrsData.fastestRetake.time} by{" "}
                                <MapperLink
                                    mapperName={wrsData.fastestRetake.player}
                                    mapperId={wrsData.fastestRetake.steamid}
                                />
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default Map_CardWRs
