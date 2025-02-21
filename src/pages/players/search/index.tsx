import MapBannerRandom from "@/components/maps/map-banner-random"

import PlayersSearchForm from "./players-search-form"
import { useEffect } from "react"

function PlayersSearch() {
    useEffect(() => {
        document.title = "Players - KZ Profile"
    }, [])

    return (
        <>
            <MapBannerRandom />
            <PlayersSearchForm />
        </>
    )
}

export default PlayersSearch
