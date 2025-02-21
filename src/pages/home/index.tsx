import { useEffect, useMemo, useState } from "react"

import { Link } from "react-router-dom"

import { timeUntilMidnightString, type TimeUntilMidnightString, cn /*todayUTC*/ } from "@/lib/utils"

import { getTierData } from "@/lib/gokz"

//import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"
import useMapOfTheDay from "@/hooks/TanStackQueries/useMapOfTheDay"
//import useMapRecentTimes from "@/hooks/TanStackQueries/useMapRecentTimes"

import { Separator } from "@/components/ui/separator"
import MapBanner from "@/pages/maps/[map-name]/map-banner"
//import RecentTimesScroll from "@/components/home/recent-times-scroll"

function Home() {
    useEffect(() => {
        document.title = "KZ Profile"
    }, [])

    //const [gameMode] = useGameMode()
    //const [runType] = useRunType()

    const [timeLeft, setTimeLeft] = useState<TimeUntilMidnightString>(timeUntilMidnightString())

    const { data: mapOfTheDay } = useMapOfTheDay()

    /*const mapRecentTimesQuery = useMapRecentTimes(
        gameMode,
        runType,
        0,
        10,
        todayUTC(),
        mapOfTheDay?.name,
    )*/

    const tierData = useMemo(() => {
        if (!mapOfTheDay) {
            return undefined
        }

        return getTierData(mapOfTheDay.difficulty)
    }, [mapOfTheDay])

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(timeUntilMidnightString())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            {mapOfTheDay && <MapBanner mapName={mapOfTheDay.name} />}
            <div className="flex h-[334px] flex-col items-center justify-evenly">
                <div className="relative flex items-end justify-center">
                    <div
                        className={cn(
                            "text-center font-mono text-xl tracking-[0.5em] sm:tracking-[1em] md:tracking-[1.5em]",
                            tierData?.color,
                        )}
                    >
                        MAP OF THE DAY
                    </div>
                    <div
                        className={cn(
                            "absolute text-center font-mono text-xl tracking-[0.5em] blur-sm sm:tracking-[1em] md:tracking-[1.5em]",
                            tierData?.color,
                        )}
                    >
                        MAP OF THE DAY
                    </div>
                </div>
                <div className="relative flex w-full justify-center">
                    <div className="absolute flex w-[350px] items-center justify-between sm:w-[500px] md:w-[670px]">
                        <span className="text-6xl font-bold tabular-nums tracking-widest blur-sm sm:text-7xl md:text-8xl">
                            {timeLeft.hours}
                        </span>
                        <span className="mb-2 text-5xl font-light text-transparent sm:text-6xl md:text-7xl">
                            :
                        </span>
                        <span className="text-6xl font-bold tabular-nums tracking-widest blur-sm sm:text-7xl md:text-8xl">
                            {timeLeft.minutes}
                        </span>
                        <span className="mb-2 text-5xl font-light text-transparent sm:text-6xl md:text-7xl">
                            :
                        </span>
                        <span className="text-6xl font-bold tabular-nums tracking-widest blur-sm sm:text-7xl md:text-8xl">
                            {timeLeft.seconds}
                        </span>
                    </div>
                    <div className="flex w-[350px] items-center justify-between sm:w-[500px] md:w-[670px]">
                        <span className="text-6xl font-bold tabular-nums tracking-widest sm:text-7xl md:text-8xl">
                            {timeLeft.hours}
                        </span>
                        <span className="mb-2 text-5xl font-light text-muted-foreground sm:text-6xl md:text-7xl">
                            :
                        </span>
                        <span className="text-6xl font-bold tabular-nums tracking-widest sm:text-7xl md:text-8xl">
                            {timeLeft.minutes}
                        </span>
                        <span className="mb-2 text-5xl font-light text-muted-foreground sm:text-6xl md:text-7xl">
                            :
                        </span>
                        <span className="text-6xl font-bold tabular-nums tracking-widest sm:text-7xl md:text-8xl">
                            {timeLeft.seconds}
                        </span>
                    </div>
                </div>
                <div className="relative">
                    <Link
                        to={`/maps/${mapOfTheDay?.name}`}
                        className={cn(
                            "flex min-h-11 bg-background py-2 pl-6 pr-2 font-mono text-xl tracking-widest transition-transform duration-1000 hover:-translate-x-[2px] hover:-translate-y-[2px] focus:translate-x-2 focus:translate-y-2 focus:duration-75 sm:tracking-[1em]",
                            tierData?.color,
                        )}
                    >
                        {mapOfTheDay?.name}
                    </Link>
                    <div
                        className={cn(
                            "absolute -bottom-2 -right-2 -z-10 min-h-11 border py-2 pl-6 pr-2 font-mono text-xl tracking-widest text-transparent sm:tracking-[1em]",
                            tierData?.border,
                        )}
                    >
                        {mapOfTheDay?.name}
                    </div>
                </div>
            </div>
            <Separator className={cn("my-4", tierData?.backgroundColor)} />
            <div className="h-[1192px]">{/*<RecentTimesScroll />*/}</div>
        </>
    )
}

export default Home
