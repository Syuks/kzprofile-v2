import { useMemo } from "react"

import { ClockIcon, DownloadIcon } from "@radix-ui/react-icons"
import { SteamIcon } from "../icons"

import { Link } from "react-router-dom"

import useKZProfileMaps from "@/hooks/TanStackQueries/useKZProfileMaps"
import { getMapImageURL, getTierData } from "@/lib/gokz"
import {
    cn,
    formatDistanceToNowStrictWithOffset,
    getFileSizeString,
    getWorkshopLink,
} from "@/lib/utils"

import { MapperListSmall } from "./mappers-list"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Badge, badgeVariants } from "@/components/ui/badge"

interface MapHoverCardProps {
    mapId: number
    mapName: string
    className?: string
}

function MapHoverCard({ mapId, mapName, className }: MapHoverCardProps) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button asChild variant="link" className={className}>
                    <Link to={`/maps/${mapName}`}>{mapName}</Link>
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto max-w-96">
                <MapHoverCardContent mapId={mapId} mapName={mapName} />
            </HoverCardContent>
        </HoverCard>
    )
}

interface MapHoverCardContentProps {
    mapId: number
    mapName: string
}

function MapHoverCardContent({ mapId, mapName }: MapHoverCardContentProps) {
    const kzProfileMapsQuery = useKZProfileMaps()

    const mapData = useMemo(() => {
        return kzProfileMapsQuery.data?.find((map) => map.id === mapId)
    }, [kzProfileMapsQuery.data])

    if (kzProfileMapsQuery.isLoading) {
        return "Loading"
    }

    if (kzProfileMapsQuery.isError) {
        return "An error occurred with KZ Profile backend."
    }

    if (!mapData) {
        return "Map not found."
    }

    const tierData = getTierData(mapData.difficulty)
    const imageUrl = getMapImageURL(mapName, "webp", "small")

    return (
        <>
            <img
                src={imageUrl}
                alt={mapName}
                className="mb-2 aspect-video w-full rounded bg-secondary"
            />
            <div className={cn(tierData.color, "text-xs uppercase")}>{tierData.label}</div>
            <Button asChild variant="link" className="h-auto p-0 text-lg">
                <Link to={`/maps/${mapName}`}>{mapName}</Link>
            </Button>
            {!!mapData.mapperNames.length && (
                <div className="text-sm text-muted-foreground">
                    by{" "}
                    <MapperListSmall
                        mapperNames={mapData.mapperNames}
                        mapperIds={mapData.mapperIds}
                    />
                </div>
            )}
            <div className="mt-4 flex space-x-2">
                <Badge variant="secondary" className="whitespace-nowrap">
                    <ClockIcon className="mr-1 h-4 w-4" />
                    {formatDistanceToNowStrictWithOffset(mapData.created_on, { addSuffix: true })}
                </Badge>
                <Badge variant="secondary" className="whitespace-nowrap">
                    <DownloadIcon className="mr-1 h-4 w-4" />
                    {getFileSizeString(mapData.filesize)}
                </Badge>
                <Link
                    to={getWorkshopLink(mapData.workshop_id)}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(badgeVariants({ variant: "secondary" }), "whitespace-nowrap")}
                >
                    <SteamIcon className="mr-1 h-4 w-4" />
                    Steam
                </Link>
            </div>
        </>
    )
}

export default MapHoverCard
