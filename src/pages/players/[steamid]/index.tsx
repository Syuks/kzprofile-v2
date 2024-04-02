import { useEffect } from "react"

import { /*NavLink,*/ useParams /*Outlet*/ } from "react-router-dom"

import useKZPlayer from "@/hooks/TanStackQueries/useKZPlayer"
import useSteamProfiles from "@/hooks/TanStackQueries/useSteamProfiles"
import usePlayerProfileKZData from "@/hooks/TanStackQueries/usePlayerProfileKZData"

import { useGameMode } from "@/components/localsettings/localsettings-provider"

//import LoadingKZ from "../../components/Loading/LoadingKZ"
//import ExperienceBar from "../../components/ExperienceBar/ExperienceBar"

//import BannerBackground from "../../components/BannerBackground/BannerBackground"
import PlayerInfo from "./player-info"
//import Completions from "../../components/Panels/CompletionsPanel/CompletionsPanel"
//import ProfilePanel from "../../components/Panels/ProfilePanel/ProfilePanel"

import { toast } from "sonner"

function PlayerProfile() {
    const { steamid } = useParams() as { steamid: string }

    const [gameMode] = useGameMode()

    /*const [currentJumpstat, setCurrentJumpstat] = useState({
        jumptype: "longjump",
        crouchbind: false,
    })*/

    // Global API Player Data. Has played? Banned?
    const kzPlayer = useKZPlayer(steamid)

    useEffect(() => {
        if (!kzPlayer.data) {
            return
        }

        if (!kzPlayer.data[0].name) {
            toast("smh. 😒", { description: "This player has never played kz." })
            return
        }

        if (kzPlayer.data[0].is_banned) {
            toast("smh. 😒", { description: "This player has been banned from the global API." })
        }
    }, [kzPlayer.data])

    // Steam profile
    const steamProfile = useSteamProfiles([steamid])

    useEffect(() => {
        if (!steamProfile.data) {
            return
        }

        if (!steamProfile.data.length) {
            toast("Uhh...", { description: "This player doesn't even exist!" })
        }
    }, [steamProfile.data])

    const playerProfileKZData = usePlayerProfileKZData(steamid, gameMode)

    if (playerProfileKZData.isLoading) {
        return "Loading..."
    }

    if (playerProfileKZData.isError) {
        return playerProfileKZData.error.message
    }

    if (!playerProfileKZData.data || !steamProfile.data) {
        return "Something weird happened. An error occurred with the global API."
    }

    return (
        <PlayerInfo
            playerProfileKZData={playerProfileKZData.data}
            steamProfile={steamProfile.data[0]}
            steamid={steamid}
        />
    )
}

export default PlayerProfile
