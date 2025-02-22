import { useEffect } from "react"

import MapOfTheDay from "./motd"
import Recent from "./recent"

function Home() {
    useEffect(() => {
        document.title = "KZ Profile"
    }, [])

    return (
        <>
            <MapOfTheDay />
            <Recent />
        </>
    )
}

export default Home
