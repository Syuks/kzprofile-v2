import { useMemo } from "react"

import { todayUTC } from "@/lib/utils"

import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import useMapOfTheDay from "@/hooks/TanStackQueries/useMapOfTheDay"
import useMapRecentTimes from "@/hooks/TanStackQueries/useMapRecentTimes"

import MapOfTheDayBanner from "./motd-banner"

function MapOfTheDay() {
    const { data: mapOfTheDay } = useMapOfTheDay()

    const [gameMode] = useGameMode()
    const [runType] = useRunType()

    const mapRecentTimesQuery = useMapRecentTimes(gameMode, runType, 0, 5, todayUTC(), mapOfTheDay)

    // The idea is to sort by time, but records/top/recent API retrieves in order,
    // and records/top doesn't have a created_since parameter.
    // So I just show the last 5 top 100 PBs.
    const mapRecentTimes = useMemo(() => mapRecentTimesQuery.data ?? [], [mapRecentTimesQuery.data])

    return (
        <>
            <MapOfTheDayBanner
                mapOfTheDay={mapOfTheDay}
                mapRecentTimes={mapRecentTimes}
                isLoading={mapRecentTimesQuery.isFetching}
            />
        </>
    )
}

export default MapOfTheDay
