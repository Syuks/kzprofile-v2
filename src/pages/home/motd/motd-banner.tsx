import { useEffect, useMemo, useState } from "react"

import { Link } from "react-router-dom"

import { cn, type TimeUntilMidnightString, timeUntilMidnightString } from "@/lib/utils"
import { getTierData } from "@/lib/gokz"

import { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"
import { RecordsTopRecentWithSteamProfile } from "@/hooks/TanStackQueries/useRecentTimes"

import MapBanner from "@/pages/maps/[map-name]/map-banner"
import { Separator } from "@/components/ui/separator"
import MapOfTheDayLeaderboard from "./motd-leaderboard"

interface MapOfTheDayBannerProps {
    mapOfTheDay: KZProfileMap | undefined
    mapRecentTimes: RecordsTopRecentWithSteamProfile[]
    isLoading?: boolean
}

function MapOfTheDayBanner({ mapOfTheDay, mapRecentTimes, isLoading }: MapOfTheDayBannerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeUntilMidnightString>(timeUntilMidnightString())

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(timeUntilMidnightString())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const tierData = useMemo(() => {
        if (!mapOfTheDay) {
            return undefined
        }

        return getTierData(mapOfTheDay.difficulty)
    }, [mapOfTheDay])

    return (
        <div className="flex min-h-[calc(100vh-7.5rem)] flex-col justify-between pt-20">
            {mapOfTheDay && (
                <MapBanner mapName={mapOfTheDay.name} className="h-[calc(100vh+3.5rem)]" />
            )}

            <div className="flex flex-col items-center">
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

                <div className="relative my-10 flex w-full justify-center">
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

                <div className="relative mb-20">
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

                <MapOfTheDayLeaderboard mapRecentTimes={mapRecentTimes} isLoading={isLoading} />
            </div>

            <div className="text-center font-mono text-sm text-muted-foreground">
                Get a top 100 PB before midnight and get featured in Map of the Day!
                <Separator className={cn("mt-4", tierData?.backgroundColor)} />
            </div>
        </div>
    )
}

export default MapOfTheDayBanner
