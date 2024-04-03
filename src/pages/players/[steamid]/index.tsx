import { useEffect } from "react"

import { Outlet, useParams, useNavigate } from "react-router-dom"

import useKZPlayer from "@/hooks/TanStackQueries/useKZPlayer"
import useSteamProfiles from "@/hooks/TanStackQueries/useSteamProfiles"
import usePlayerProfileKZData, {
    PlayerProfileKZData,
} from "@/hooks/TanStackQueries/usePlayerProfileKZData"

import { useGameMode } from "@/components/localsettings/localsettings-provider"

//import LoadingKZ from "../../components/Loading/LoadingKZ"

//import BannerBackground from "../../components/BannerBackground/BannerBackground"
import PlayerInfo from "./player-info"
//import Completions from "../../components/Panels/CompletionsPanel/CompletionsPanel"

import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface PlayerProfileOutletContext {
    playerProfileKZData: PlayerProfileKZData
}

function PlayerProfile() {
    const { steamid } = useParams() as { steamid: string }
    const navigate = useNavigate()

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
        <>
            <div className="py-10">
                <PlayerInfo
                    playerProfileKZData={playerProfileKZData.data}
                    steamProfile={steamProfile.data[0]}
                    steamid={steamid}
                />
            </div>
            <Tabs defaultValue="" className="mb-10">
                <TabsList>
                    <TabsTrigger onClick={() => navigate("")} value="">
                        Finishes
                    </TabsTrigger>
                    <TabsTrigger onClick={() => navigate("unfinishes")} value="unfinishes">
                        Unfinishes
                    </TabsTrigger>
                    <TabsTrigger onClick={() => navigate("jumpstats")} value="jumpstats">
                        Jumpstats
                    </TabsTrigger>
                    <TabsTrigger onClick={() => navigate("stats")} value="stats">
                        Statistics
                    </TabsTrigger>
                    <TabsTrigger onClick={() => navigate("achievements")} value="achievements">
                        Achievements
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <Outlet
                context={
                    {
                        playerProfileKZData: playerProfileKZData.data,
                    } satisfies PlayerProfileOutletContext
                }
            />
            <ExperienceBar playerProfileKZData={playerProfileKZData.data} />
        </>
    )
}

interface ExperienceBarProps {
    playerProfileKZData: PlayerProfileKZData
}

function ExperienceBar({ playerProfileKZData }: ExperienceBarProps) {
    return (
        <Tooltip delayDuration={200}>
            <TooltipTrigger className="group container fixed bottom-0 left-0 right-0 inline-flex h-4 items-end overflow-hidden">
                <div className="relative h-[1px] w-full bg-foreground/60 transition-all group-hover:h-2">
                    <div className="absolute bottom-0 left-0 flex h-1 w-full">
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-4 border-r-background group-hover:border-r-2"></div>
                        <div className="h-2 w-1/12 border-r-background"></div>
                    </div>
                    <div
                        className={`h-full ${playerProfileKZData.rank.backgroundColor}`}
                        style={{ width: `${playerProfileKZData.rank.percent * 100}%` }}
                    ></div>
                </div>
            </TooltipTrigger>
            <TooltipContent
                side="top"
                align="start"
                className="border bg-background text-foreground"
            >
                <div>{playerProfileKZData.rank.prevThreshold.toLocaleString()} pts.</div>
            </TooltipContent>
            <TooltipContent
                side="top"
                align="center"
                className="border bg-background text-foreground"
            >
                <div>
                    {playerProfileKZData.rank.points.toLocaleString()} pts. •{" "}
                    {(playerProfileKZData.rank.percent * 100).toFixed(2)}%
                </div>
            </TooltipContent>
            <TooltipContent side="top" align="end" className="border bg-background text-foreground">
                <div>{playerProfileKZData.rank.nextThreshold.toLocaleString()} pts.</div>
            </TooltipContent>
        </Tooltip>
    )
}

export default PlayerProfile
