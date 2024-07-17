import { useMemo } from "react"

import MapBanner from "@/pages/maps/[map-name]/map-banner"

import useKZProfileMaps from "@/hooks/TanStackQueries/useKZProfileMaps"

function MapBannerRandom() {
    const kzProfileMapsQuery = useKZProfileMaps()

    const mapName = useMemo<string | undefined>(() => {
        if (!kzProfileMapsQuery.data) {
            return undefined
        }

        const randomIndex = Math.floor(Math.random() * kzProfileMapsQuery.data.length)

        return kzProfileMapsQuery.data[randomIndex].name
    }, [kzProfileMapsQuery.data])

    return mapName && <MapBanner mapName={mapName} />
}

export default MapBannerRandom
