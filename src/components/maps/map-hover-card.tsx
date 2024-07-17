import { useMemo } from "react"

import { Link } from "react-router-dom"

import useKZProfileMaps from "@/hooks/TanStackQueries/useKZProfileMaps"

import MapCard from "./map-card"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

interface MapHoverCardProps {
    mapName: string
    className?: string
}

function MapHoverCard({ mapName, className }: MapHoverCardProps) {
    const kzProfileMapsQuery = useKZProfileMaps()

    const mapData = useMemo(() => {
        return kzProfileMapsQuery.data?.find((map) => map.name === mapName)
    }, [kzProfileMapsQuery.data])

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button asChild variant="link" className={className}>
                    <Link to={`/maps/${mapName}`}>{mapName}</Link>
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
                {mapData && <MapCard kzProfileMap={mapData} withDropdown={false} />}
            </HoverCardContent>
        </HoverCard>
    )
}

export default MapHoverCard
