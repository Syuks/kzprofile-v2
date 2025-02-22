import { useMemo } from "react"

import { Link } from "react-router-dom"

import {
    addOrdinalSuffix,
    cn,
    formatDistanceToNowStrictWithOffset,
    getTimeString,
} from "@/lib/utils"
import { getMapImageURL, getTierData } from "@/lib/gokz"

import { RecordsTopRecentWithSteamProfile } from "@/hooks/TanStackQueries/useRecentTimes"
import useKZProfileMaps from "@/hooks/TanStackQueries/useKZProfileMaps"

import { Button } from "@/components/ui/button"

interface WRCardProps {
    record: RecordsTopRecentWithSteamProfile
}

function WRCard({ record }: WRCardProps) {
    const kzProfileMaps = useKZProfileMaps()

    const mapImageURL = useMemo(() => {
        return getMapImageURL(record.map_name, "webp", "medium")
    }, [record])

    const tierData = useMemo(() => {
        if (!kzProfileMaps.data) {
            return undefined
        }

        const globalMap = kzProfileMaps.data.find((map) => map.name === record.map_name)

        if (!globalMap) {
            return undefined
        }

        return getTierData(globalMap.difficulty)
    }, [kzProfileMaps.data, record])

    return (
        <>
            <div className="group relative block overflow-hidden rounded">
                <img
                    src={mapImageURL}
                    className="aspect-video w-full rounded bg-secondary transition-all duration-300 ease-out group-hover:scale-110 group-hover:blur-sm"
                />
                <div
                    className={cn(
                        tierData?.shadow,
                        "absolute left-0 top-1 flex h-full w-full flex-col items-center justify-center transition-all duration-300 ease-out [text-shadow:_4px_4px_4px_black] hover:shadow-[0_-4px_0_0_inset] group-hover:top-0",
                    )}
                >
                    <div className="flex items-center">
                        <Button asChild variant="ghost" size="icon" className="rounded-full">
                            <Link to={`/players/${record.steamid64}`}>
                                <img
                                    src={record.steamProfile.avatar}
                                    className="h-full w-full rounded-full"
                                />
                            </Link>
                        </Button>
                        <Button asChild variant="link" className="text-base">
                            <Link to={`/players/${record.steamid64}`} className="truncate p-1">
                                {record.player_name}
                            </Link>
                        </Button>
                    </div>
                    {/*<div className="mt-2 w-full text-center text-sm opacity-0 transition group-hover:opacity-100">
                        {getTimeString(record.time)}
                    </div>*/}
                </div>
            </div>

            <div className="mt-2">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <span>{getTimeString(record.time)}</span>
                    <span>•</span>
                    <span>{addOrdinalSuffix(record.place)}</span>
                </div>

                <Button asChild variant="link" className="h-auto p-0 text-lg">
                    <Link to={`/maps/${record.map_name}`}>{record.map_name}</Link>
                </Button>

                <div className="text-sm text-muted-foreground">
                    {formatDistanceToNowStrictWithOffset(record.created_on, {
                        addSuffix: true,
                    })}
                </div>
            </div>
        </>
    )
}

export default WRCard
