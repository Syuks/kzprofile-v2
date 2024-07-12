import { useMemo } from "react"

import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"
import { getMapImageURL, getTierData, TierData } from "@/lib/gokz"
import { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"

import { MapperListSmall } from "./mappers-list"
import { Button } from "@/components/ui/button"

interface MapCardProps {
    kzProfileMap: KZProfileMap
}

function MapCard({ kzProfileMap }: MapCardProps) {
    const tierData: TierData = useMemo(() => getTierData(kzProfileMap.difficulty), [kzProfileMap])
    const mapImageURL = useMemo(
        () => getMapImageURL(kzProfileMap.name, "webp", "medium"),
        [kzProfileMap],
    )

    return (
        <>
            <Link to={kzProfileMap.name} className="group relative block overflow-hidden rounded">
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
            </Link>

            <div className={cn(tierData.color, "mt-2 text-xs uppercase")}>{tierData.label}</div>

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

            {/*<div className="mt-4 flex space-x-2">
                <Badge variant="secondary" className="whitespace-nowrap">
                    <ClockIcon className="mr-1 h-4 w-4" />
                    {formatDistanceToNowStrictWithOffset(kzProfileMap.created_on, {
                        addSuffix: true,
                    })}
                </Badge>
                <Badge variant="secondary" className="whitespace-nowrap">
                    <DownloadIcon className="mr-1 h-4 w-4" />
                    {getFileSizeString(kzProfileMap.filesize)}
                </Badge>
                <Link
                    to={getWorkshopLink(kzProfileMap.workshop_id)}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(badgeVariants({ variant: "secondary" }), "whitespace-nowrap")}
                >
                    <SteamIcon className="mr-1 h-4 w-4" />
                    Steam
                </Link>
            </div>*/}
        </>
    )
}

export default MapCard
