import { GitHubLogoIcon } from "@radix-ui/react-icons"

import { Link, useOutletContext } from "react-router-dom"

import { MapLayoutOutletContext } from "."

import MapVideoGallery from "@/components/maps/map-video-gallery"

import { Button } from "@/components/ui/button"

function MapMedia() {
    const { kzProfileMap } = useOutletContext<MapLayoutOutletContext>()

    return (
        <>
            <div className="flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Media
                </h2>
                <div className="flex space-x-2">
                    <Button variant="outline" asChild>
                        <Link
                            to="https://github.com/Syuks/KZProfile"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <GitHubLogoIcon className="mr-2 h-4 w-4" />
                            Contribute
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="mb-24 mt-8">
                <MapVideoGallery videos={kzProfileMap?.videos ?? []} />
            </div>
        </>
    )
}

export default MapMedia
