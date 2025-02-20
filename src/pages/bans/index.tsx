//import MapBannerRandom from "@/components/maps/map-banner-random"
import MapBanner from "@/pages/maps/[map-name]/map-banner"

import BansForm from "./bans-form"

function Bans() {
    return (
        <>
            <MapBanner mapName="kz_evilcorp" />
            <BansForm />
        </>
    )
}

export default Bans
