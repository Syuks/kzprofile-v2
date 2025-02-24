import { useMemo } from "react"

import { Pencil1Icon, StopwatchIcon, VideoIcon } from "@radix-ui/react-icons"

import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"
import { getGameModeID, getMapImageURL, getTierData, TierData } from "@/lib/gokz"
import { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"
import { useGameMode } from "@/components/localsettings/localsettings-provider"

import { MapperListSmall } from "@/components/maps/mappers-list"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

interface AdminMapCardProps {
    kzProfileMap: KZProfileMap
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    setDialogMap: React.Dispatch<React.SetStateAction<KZProfileMap | undefined>>
}

function AdminMapCard({ kzProfileMap, setOpenDialog, setDialogMap }: AdminMapCardProps) {
    const [gameMode] = useGameMode()
    const tierData: TierData = useMemo(() => getTierData(kzProfileMap.difficulty), [kzProfileMap])
    const mapImageURL = useMemo(
        () => getMapImageURL(kzProfileMap.name, "webp", "medium"),
        [kzProfileMap],
    )

    return (
        <>
            <div className="group relative block overflow-hidden rounded">
                <img
                    src={mapImageURL}
                    className="aspect-video w-full rounded bg-secondary transition-all duration-300 ease-out group-hover:scale-110 group-hover:blur-sm"
                />
                <div
                    className={cn(
                        tierData.shadow,
                        "absolute left-0 top-1 flex h-full w-full flex-col items-center justify-center opacity-0 transition-all duration-300 ease-out [text-shadow:_4px_4px_4px_black] hover:shadow-[0_-4px_0_0_inset] group-hover:top-0 group-hover:opacity-100",
                    )}
                >
                    <Button asChild variant="link" className="text-base">
                        <Link to={`/maps/${kzProfileMap.name}`} className="truncate p-1">
                            {kzProfileMap.name}
                        </Link>
                    </Button>
                    {!!kzProfileMap.mapperNames.length && (
                        <div className="text-sm text-muted-foreground">
                            by{" "}
                            <MapperListSmall
                                mapperNames={kzProfileMap.mapperNames}
                                mapperIds={kzProfileMap.mapperIds}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-2 flex">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 text-xs uppercase text-muted-foreground">
                        <span className={tierData.color}>{tierData.label}</span>
                        {kzProfileMap.filters.includes(getGameModeID(gameMode)) && (
                            <>
                                <span>•</span>
                                <Tooltip>
                                    <TooltipTrigger className="cursor-pointer" asChild>
                                        <StopwatchIcon className="h-3 w-3" />
                                    </TooltipTrigger>
                                    <TooltipContent className="normal-case">
                                        <p>Has filter</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}
                        {kzProfileMap.bonus_count > 0 && (
                            <>
                                <span>•</span>
                                <Tooltip>
                                    <TooltipTrigger className="cursor-default" asChild>
                                        <span>{`${kzProfileMap.bonus_count}B`}</span>
                                    </TooltipTrigger>
                                    <TooltipContent className="normal-case">
                                        <p>
                                            {kzProfileMap.bonus_count}{" "}
                                            {kzProfileMap.bonus_count > 1 ? "bonuses" : "bonus"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}
                        {kzProfileMap.videos.length > 0 && (
                            <>
                                <span>•</span>
                                <Tooltip>
                                    <TooltipTrigger className="cursor-pointer" asChild>
                                        <Link to={`/maps/${kzProfileMap.name}/media`}>
                                            <VideoIcon className="h-3 w-3" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="normal-case">
                                        <p>
                                            {kzProfileMap.videos.length}{" "}
                                            {kzProfileMap.videos.length > 1 ? "videos" : "video"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}
                    </div>

                    <Button asChild variant="link" className="h-auto p-0 text-lg">
                        <Link to={`/maps/${kzProfileMap.name}`}>{kzProfileMap.name}</Link>
                    </Button>

                    {!!kzProfileMap.mapperNames.length && (
                        <div className="text-sm text-muted-foreground">
                            by{" "}
                            <MapperListSmall
                                mapperNames={kzProfileMap.mapperNames}
                                mapperIds={kzProfileMap.mapperIds}
                            />
                        </div>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        setDialogMap(kzProfileMap)
                        setOpenDialog(true)
                    }}
                >
                    <Pencil1Icon className="h-4 w-4" />
                </Button>
            </div>
        </>
    )
}

function LoadingAdminMapCard() {
    return (
        <>
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="mt-2 h-6 w-40" />
            <Skeleton className="mb-4 mt-2 h-4 w-20" />
        </>
    )
}

export default AdminMapCard
export { LoadingAdminMapCard }
