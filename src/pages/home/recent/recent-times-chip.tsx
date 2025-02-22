import { getTimeString } from "@/lib/utils"

import { RecordsTopRecentWithSteamProfile } from "@/hooks/TanStackQueries/useRecentTimes"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentTimesChipProps {
    record: RecordsTopRecentWithSteamProfile
}

function RecentTimesChip({ record }: RecentTimesChipProps) {
    return (
        <Button
            variant="ghost"
            className="relative flex h-12 w-[200px] flex-shrink-0 justify-start space-x-2 overflow-hidden rounded-none border border-csgo-lime bg-center pl-1"
            /*style={{
                backgroundImage: `url("${mapImageURL}")`,
            }}*/
        >
            <Avatar className="rounded-none">
                <AvatarImage src={record.steamProfile.avatar} alt={record.player_name} />
                <AvatarFallback>{record.player_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm">
                <div className="text-csgo-lime">{record.player_name}</div>
                <div className="text-xs text-muted-foreground">{getTimeString(record.time)}</div>
            </div>
        </Button>
    )
}

export default RecentTimesChip
