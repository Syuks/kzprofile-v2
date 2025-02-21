import { useMemo } from "react"

import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"
import { todayUTC, cn, getTimeString } from "@/lib/utils"
import { getMapImageURL, getTierData } from "@/lib/gokz"

import useRecentTimes, {
    RecordsTopRecentWithSteamProfile,
} from "@/hooks/TanStackQueries/useRecentTimes"
import useKZProfileMaps from "@/hooks/TanStackQueries/useKZProfileMaps"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function RecentTimesScroll() {
    const [gameMode] = useGameMode()
    const [runType] = useRunType()

    const mapRecentTimesQuery = useRecentTimes(gameMode, runType, 0, 20, todayUTC())

    return (
        <div className="flex space-x-4">
            {mapRecentTimesQuery.data?.map((record) => (
                <RecentTimesScrollItem key={record.id} record={record} />
            ))}
        </div>
    )
}

export default RecentTimesScroll

interface RecentTimesScrollItemProps {
    record: RecordsTopRecentWithSteamProfile
}

function RecentTimesScrollItem({ record }: RecentTimesScrollItemProps) {
    const globalMaps = useKZProfileMaps()

    const mapTierData = useMemo(() => {
        if (!globalMaps.data) {
            return undefined
        }

        const globalMap = globalMaps.data.find((map) => map.name === record.map_name)

        if (!globalMap) {
            return undefined
        }

        return getTierData(globalMap.difficulty)
    }, [globalMaps.data, record])

    const mapImageURL = useMemo(() => {
        return getMapImageURL(record.map_name, "webp", "small")
    }, [record])

    return (
        <Button
            className={cn(
                "flex h-12 justify-between space-x-2 rounded-full border pl-1 pr-4",
                mapTierData?.border,
            )}
            /*style={{
                backgroundImage: `url("${getMapImageURL(record.map_name, "webp", "small")}")`,
            }}*/
        >
            <img src={mapImageURL} alt={record.map_name} className="absolute top-0 h-full w-full" />
            <Avatar>
                <AvatarImage src={record.steamProfile.avatar} alt={record.player_name} />
                <AvatarFallback>{record.player_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm">
                <div>{record.map_name}</div>
                <div>{getTimeString(record.time)}</div>
            </div>
        </Button>
    )
}
