import { PropsWithChildren, useEffect } from "react"

import {
    TextAlignLeftIcon,
    StopwatchIcon,
    ShuffleIcon,
    BarChartIcon,
    LockOpen1Icon,
} from "@radix-ui/react-icons"

import { Outlet, useParams, NavLink } from "react-router-dom"

import useKZPlayer from "@/hooks/TanStackQueries/useKZPlayer"
import useSteamProfiles from "@/hooks/TanStackQueries/useSteamProfiles"
import usePlayerProfileKZData, {
    PlayerProfileKZData,
} from "@/hooks/TanStackQueries/usePlayerProfileKZData"

import { useGameMode } from "@/components/localsettings/localsettings-provider"

import PlayerInfo from "./player-info"

import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface PlayerProfileOutletContext {
    steamid: string
    playerProfileKZData: PlayerProfileKZData | undefined
    playerProfileKZDataRefetch: () => void
    playerProfileKZDataFetching: boolean
}

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

        if (!kzPlayer.data.name) {
            toast("smh. 😒", { description: "This player has never played kz." })
            document.title = "KZ Profile"
            return
        }

        document.title = `${kzPlayer.data.name} - KZ Profile`

        if (kzPlayer.data.is_banned) {
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

    return (
        <>
            <div className="py-10">
                <PlayerInfo
                    playerProfileKZData={playerProfileKZData.data}
                    steamProfile={steamProfile.data?.[0]}
                    steamid={steamid}
                />
            </div>
            <div className="space-x-2">
                <PlayerProfileNavLink
                    path=""
                    end={true}
                    playerProfileKZData={playerProfileKZData.data}
                >
                    <TextAlignLeftIcon className="mr-2 h-4 w-4" />
                    Finishes
                </PlayerProfileNavLink>
                <PlayerProfileNavLink
                    path="unfinishes"
                    playerProfileKZData={playerProfileKZData.data}
                >
                    <StopwatchIcon className="mr-2 h-4 w-4" />
                    Unfinishes
                </PlayerProfileNavLink>
                <PlayerProfileNavLink
                    path="jumpstats"
                    playerProfileKZData={playerProfileKZData.data}
                >
                    <ShuffleIcon className="mr-2 h-4 w-4" />
                    Jumpstats
                </PlayerProfileNavLink>
                <PlayerProfileNavLink path="stats" playerProfileKZData={playerProfileKZData.data}>
                    <BarChartIcon className="mr-2 h-4 w-4" />
                    Statistics
                </PlayerProfileNavLink>
                <PlayerProfileNavLink
                    path="achievements"
                    playerProfileKZData={playerProfileKZData.data}
                >
                    <LockOpen1Icon className="mr-2 h-4 w-4" />
                    Achievements
                </PlayerProfileNavLink>
            </div>
            <ExperienceBar playerProfileKZData={playerProfileKZData.data} />
            <div className="py-10">
                <Outlet
                    context={
                        {
                            steamid: steamid,
                            playerProfileKZData: playerProfileKZData.data,
                            playerProfileKZDataRefetch: playerProfileKZData.refetch,
                            playerProfileKZDataFetching: playerProfileKZData.isFetching,
                        } satisfies PlayerProfileOutletContext
                    }
                />
            </div>
        </>
    )
}

interface ExperienceBarProps {
    playerProfileKZData: PlayerProfileKZData | undefined
}

function ExperienceBar({ playerProfileKZData }: ExperienceBarProps) {
    return (
        <Tooltip delayDuration={200}>
            <TooltipTrigger className="h-4 w-full cursor-pointer overflow-hidden">
                <div className="relative h-[1px] w-full bg-foreground/60">
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
                    {!!playerProfileKZData && (
                        <div
                            className={cn("h-full", playerProfileKZData.rank.backgroundColor)}
                            style={{ width: `${playerProfileKZData.rank.percent * 100}%` }}
                        ></div>
                    )}
                </div>
            </TooltipTrigger>
            {!!playerProfileKZData && (
                <>
                    <TooltipContent
                        side="bottom"
                        align="start"
                        className="border bg-background text-foreground"
                    >
                        <div>{playerProfileKZData.rank.prevThreshold.toLocaleString()} pts.</div>
                    </TooltipContent>
                    <TooltipContent
                        side="bottom"
                        align="center"
                        className="border bg-background text-foreground"
                    >
                        <div>
                            {playerProfileKZData.rank.points.toLocaleString()} pts. •{" "}
                            {(playerProfileKZData.rank.percent * 100).toFixed(2)}%
                        </div>
                    </TooltipContent>
                    <TooltipContent
                        side="bottom"
                        align="end"
                        className="border bg-background text-foreground"
                    >
                        <div>{playerProfileKZData.rank.nextThreshold.toLocaleString()} pts.</div>
                    </TooltipContent>
                </>
            )}
        </Tooltip>
    )
}

interface PlayerProfileNavLinkProps {
    path: string
    playerProfileKZData: PlayerProfileKZData | undefined
    end?: boolean | undefined
}

function PlayerProfileNavLink({
    path,
    playerProfileKZData,
    end,
    children,
}: PropsWithChildren<PlayerProfileNavLinkProps>) {
    return (
        <NavLink
            to={path}
            end={end}
            className={({ isActive }) =>
                cn(
                    isActive
                        ? buttonVariants({ variant: "outline" })
                        : buttonVariants({ variant: "ghost" }),
                    isActive && playerProfileKZData ? playerProfileKZData.rank.border : "",
                    "mt-1 justify-start",
                )
            }
        >
            {children}
        </NavLink>
    )
}

export default PlayerProfile
