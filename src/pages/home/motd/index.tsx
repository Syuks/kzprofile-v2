import { useMemo } from "react"

//import { todayUTC } from "@/lib/utils"

import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import useMapOfTheDay from "@/hooks/TanStackQueries/useMapOfTheDay"
import useMapRecentTimes from "@/hooks/TanStackQueries/useMapRecentTimes"

import MapOfTheDayBanner from "./motd-banner"

function MapOfTheDay() {
    const { data: mapOfTheDay } = useMapOfTheDay()

    const [gameMode] = useGameMode()
    const [runType] = useRunType()

    const mapRecentTimesQuery = useMapRecentTimes(
        gameMode,
        runType,
        0,
        5,
        "2020-12-31",
        mapOfTheDay?.name,
    )

    const sortedMapRecentTimes = useMemo(() => {
        if (!mapRecentTimesQuery.data) {
            return []
        }

        return mapRecentTimesQuery.data.sort((a, b) => a.time - b.time)
    }, [mapRecentTimesQuery.data])

    return (
        <>
            <MapOfTheDayBanner
                mapOfTheDay={mapOfTheDay}
                mapRecentTimes={sortedMapRecentTimes}
                isLoading={mapRecentTimesQuery.isFetching}
            />
        </>
    )
}

export default MapOfTheDay
