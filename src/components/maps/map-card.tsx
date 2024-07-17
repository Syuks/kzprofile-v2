import { useCallback, useMemo } from "react"

import {
    BarChartIcon,
    DesktopIcon,
    DotsVerticalIcon,
    ImageIcon,
    InfoCircledIcon,
    StopwatchIcon,
    VideoIcon,
} from "@radix-ui/react-icons"
import { SteamIcon } from "../icons"

import { Link } from "react-router-dom"

import { cn, getWorkshopLink } from "@/lib/utils"
import { getGameModeID, getGameModeName, getMapImageURL, getTierData, TierData } from "@/lib/gokz"
import { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"
import { useGameMode } from "../localsettings/localsettings-provider"

import { MapperListSmall } from "./mappers-list"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface MapCardProps {
    kzProfileMap: KZProfileMap
    withDropdown?: boolean
}

function MapCard({ kzProfileMap, withDropdown = true }: MapCardProps) {
    const [gameMode] = useGameMode()
    const tierData: TierData = useMemo(() => getTierData(kzProfileMap.difficulty), [kzProfileMap])
    const mapImageURL = useMemo(
        () => getMapImageURL(kzProfileMap.name, "webp", "medium"),
        [kzProfileMap],
    )

    const getID = useCallback(() => {
        toast(`Map ID of ${kzProfileMap.name}:`, {
            description: kzProfileMap.id,
        })
    }, [kzProfileMap])

    const getFilters = useCallback(() => {
        toast(`${kzProfileMap.name} has filters in:`, {
            description: kzProfileMap.filters
                .map((gameModeID) => getGameModeName(gameModeID))
                .join(", "),
        })
    }, [kzProfileMap])

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
                        "absolute left-0 top-1 flex h-full w-full flex-col items-center justify-center opacity-0 shadow-[0_-4px_0_0_inset] transition-all duration-300 ease-out [text-shadow:_4px_4px_4px_black] group-hover:top-0 group-hover:opacity-100",
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
                                <StopwatchIcon className="h-3 w-3" />
                            </>
                        )}
                        {kzProfileMap.bonus_count > 0 && (
                            <>
                                <span>•</span>
                                <span>{`${kzProfileMap.bonus_count}B`}</span>
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
                {withDropdown && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <DotsVerticalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                MAP
                            </DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link to={`/maps/${kzProfileMap.name}`}>
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        <span>Visit map</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={`/maps/${kzProfileMap.name}/media`}>
                                        <VideoIcon className="mr-2 h-4 w-4" />
                                        <span>Videos</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={`/maps/${kzProfileMap.name}/stats`}>
                                        <BarChartIcon className="mr-2 h-4 w-4" />
                                        <span>Stats</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to={`/maps/${kzProfileMap.name}/servers`}>
                                        <DesktopIcon className="mr-2 h-4 w-4" />
                                        <span>Find server</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                    INFO
                                </DropdownMenuLabel>
                                <DropdownMenuItem onSelect={getID}>
                                    <InfoCircledIcon className="mr-2 h-4 w-4" />
                                    Get ID
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={getFilters}>
                                    <StopwatchIcon className="mr-2 h-4 w-4" />
                                    Filters
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                    STEAM
                                </DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link
                                        to={getWorkshopLink(kzProfileMap.workshop_id)}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <SteamIcon className="mr-2 h-4 w-4" />
                                        Workshop
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </>
    )
}

export default MapCard
