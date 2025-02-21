import { Link } from "react-router-dom"

import { ClockIcon, DownloadIcon } from "@radix-ui/react-icons"
import { SteamIcon } from "@/components/icons"

import { lightFormat } from "date-fns"

import {
    cn,
    formatDistanceToNowStrictWithOffset,
    getFileSizeString,
    getWorkshopLink,
} from "@/lib/utils"
import { TierData, getMapImageURL } from "@/lib/gokz"
import { KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"
import { useLocalSettings } from "@/components/localsettings/localsettings-provider"

import { MappersList } from "@/components/maps/mappers-list"

import { Skeleton } from "@/components/ui/skeleton"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface MapInfoProps {
    stage: number
    mapTierData: TierData | undefined
    kzProfileMap: KZProfileMap | undefined
}

function MapInfo({ stage, mapTierData, kzProfileMap }: MapInfoProps) {
    const [localSettings] = useLocalSettings()

    if (!kzProfileMap || !mapTierData || stage === undefined) {
        return (
            <div className="flex">
                <Skeleton className="h-44 w-80 rounded" />
                <div className="ml-6">
                    <Skeleton className="h-14 w-72" />
                    <Skeleton className="mt-6 h-10 w-48" />
                    <Skeleton className="mt-6 h-8 w-32" />
                </div>
            </div>
        )
    }

    return (
        <div className="flex space-x-6">
            <div className="flex shrink-0 flex-col">
                <Link
                    to={getWorkshopLink(kzProfileMap.workshop_id)}
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        src={getMapImageURL(kzProfileMap.name, "webp", "full")}
                        alt={kzProfileMap.name}
                        className="h-44 rounded"
                    />
                </Link>
                <div className="mt-4 flex justify-between">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                className={cn(
                                    badgeVariants({ variant: "outline" }),
                                    "h-auto whitespace-nowrap bg-background hover:bg-background",
                                )}
                            >
                                <ClockIcon className="mr-1 h-4 w-4" />
                                {formatDistanceToNowStrictWithOffset(kzProfileMap.created_on, {
                                    addSuffix: true,
                                })}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>{lightFormat(kzProfileMap.created_on, localSettings.dateFormat)}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Badge variant="outline" className="whitespace-nowrap bg-background">
                        <DownloadIcon className="mr-1 h-4 w-4" />
                        {getFileSizeString(kzProfileMap.filesize)}
                    </Badge>
                    <Link
                        to={getWorkshopLink(kzProfileMap.workshop_id)}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                            badgeVariants({ variant: "outline" }),
                            "whitespace-nowrap bg-background",
                        )}
                    >
                        <SteamIcon className="mr-1 h-4 w-4" />
                        Steam
                    </Link>
                </div>
            </div>
            <div>
                <div className="font-light">{kzProfileMap.name}</div>

                <div
                    className={cn(
                        "ml-[2px] mt-3 text-5xl",
                        stage === 0 ? mapTierData.color : "text-muted-foreground",
                    )}
                >
                    {stage === 0 ? mapTierData.label : `BONUS ${stage}`}
                </div>

                {!!kzProfileMap.mapperNames.length && (
                    <div className="ml-[5px] mt-2 text-sm text-muted-foreground">
                        by{" "}
                        <MappersList
                            mapperNames={kzProfileMap.mapperNames}
                            mapperIds={kzProfileMap.mapperIds}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default MapInfo
