import { useMemo } from "react"

import { getMapImageURL } from "@/lib/gokz"
import { cn } from "@/lib/utils"

interface MapBannerProps {
    mapName: string
    imageFormat?: "jpg" | "webp"
    imageSize?: "full" | "medium" | "small"
    className?: string
}

function MapBanner({
    mapName,
    imageFormat = "webp",
    imageSize = "full",
    className,
}: MapBannerProps) {
    const imageUrl = useMemo(() => {
        return getMapImageURL(mapName, imageFormat, imageSize)
    }, [mapName])

    return (
        <div
            className={cn(
                "absolute -top-14 left-0 -z-10 h-[528px] w-full bg-cover bg-fixed bg-center bg-no-repeat opacity-20 sm:blur-sm",
                className,
            )}
            style={{ backgroundImage: `url("${imageUrl}")` }}
        ></div>
    )
}

export default MapBanner
