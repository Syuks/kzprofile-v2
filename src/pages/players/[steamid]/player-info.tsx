import GoldMedal from "@/assets/medals/1000.png"
import GoldMedalEmpty from "@/assets/medals/1000-empty.png"
import RedMedal from "@/assets/medals/900.png"
import RedMedalEmpty from "@/assets/medals/900-empty.png"
import BlueMedal from "@/assets/medals/800.png"
import BlueMedalEmpty from "@/assets/medals/800-empty.png"
import AvatarFrame from "@/assets/frames/frame1.png"

import { Link } from "react-router-dom"

import useAutoResizeFont from "@/hooks/useAutoResizeFont"
import type { SteamPlayerSummary } from "@/hooks/TanStackQueries/useSteamProfiles"
import type { PlayerProfileKZData } from "@/hooks/TanStackQueries/usePlayerProfileKZData"

import PlayerFlag from "@/components/flag/player-flag"
//import Role from "../../Roles/Role"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface PlayerInfoProps {
    steamid: string
    steamProfile: SteamPlayerSummary | undefined
    playerProfileKZData: PlayerProfileKZData | undefined
    apiLoading?: boolean
}

function PlayerInfo({ steamid, steamProfile, playerProfileKZData, apiLoading }: PlayerInfoProps) {
    /*const PlayerSocials = (
        <>
            {playerProfile?.socials.t &&
            <a href={playerProfile.socials.t} target="_blank" rel="noreferrer" className="p-overlay-badge">
                <FaTwitch />
                <Badge style={{background:"#e91916"}} />
            </a>}
            {playerProfile?.socials.y &&
            <a href={playerProfile.socials.y} target="_blank" rel="noreferrer" >
                <FaYoutube />
            </a>}
            {playerProfile?.socials.d &&
            <a href={playerProfile.socials.d} target="_blank" rel="noreferrer" >
                <FaDiscord />
            </a>}
        </>
    )*/

    /*const PlayerRoles = playerProfile && playerProfile.roles.map(role=>{
        return (
            <Role roleID={role} key={role} />
        )
    })*/

    const {
        containerRef: playerNameContainerRef,
        textRef: playerNameTextRef,
        fontSize: playerNameFontSize,
    } = useAutoResizeFont(72, 16, steamProfile)
    const { containerRef: playerRankContainerRef, textRef: playerRankTextRef } = useAutoResizeFont(
        48,
        16,
        steamProfile,
    )
    const { containerRef: playerPointsContainerRef, textRef: playerPointsTextRef } =
        useAutoResizeFont(36, 16, steamProfile)

    return (
        <div className="flex flex-col md:flex-row">
            <div className="flex justify-center md:block">
                <div className="mt-0 h-[184px] w-[184px] bg-zinc-950 md:mt-4">
                    <Link
                        to={`https://steamcommunity.com/profiles/${steamid}/`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="relative">
                            <img
                                src={AvatarFrame}
                                alt="frame"
                                className="absolute -left-[20px] -top-[20px] hidden max-w-none"
                            />
                        </div>
                        {!!steamProfile ? (
                            <img
                                className="h-full w-full rounded"
                                src={steamProfile.avatarfull}
                                alt="playerAvatar"
                            />
                        ) : (
                            <Skeleton className="h-full w-full rounded" />
                        )}
                    </Link>
                </div>
                {/*<div className="socials-row">{PlayerSocials}</div>*/}
            </div>

            <div className="my-4 flex flex-row items-center justify-around md:my-0 md:ml-12 md:flex-col">
                <div className="md:order-0 relative order-1 mt-2 w-20">
                    {!!playerProfileKZData && playerProfileKZData.medals.gold > 0 ? (
                        <>
                            <img src={GoldMedal} alt="1000-medal" />
                            <Badge
                                variant="secondary"
                                className="pointer-events-none absolute left-[50px] top-[10px] bg-medals-gold px-2 text-white"
                            >
                                {playerProfileKZData.medals.gold}
                            </Badge>
                        </>
                    ) : (
                        <img src={GoldMedalEmpty} alt="1000-medal-emty" />
                    )}
                </div>
                <div className="order-0 relative mt-[1.15rem] md:order-1">
                    {!!playerProfileKZData && playerProfileKZData.medals.red > 0 ? (
                        <>
                            <img src={RedMedal} alt="900-medal" />
                            <Badge
                                variant="secondary"
                                className="pointer-events-none absolute left-[34px] top-0 bg-medals-red px-2 text-white"
                            >
                                {playerProfileKZData.medals.red}
                            </Badge>
                        </>
                    ) : (
                        <img src={RedMedalEmpty} alt="900-medal-empty" />
                    )}
                </div>
                <div className="relative order-2 mt-[0.35rem]">
                    {!!playerProfileKZData && playerProfileKZData.medals.blue > 0 ? (
                        <>
                            <img src={BlueMedal} alt="800-mdeal" />
                            <Badge
                                variant="secondary"
                                className="pointer-events-none absolute left-[34px] top-0 bg-medals-blue px-2 text-white"
                            >
                                {playerProfileKZData.medals.blue}
                            </Badge>
                        </>
                    ) : (
                        <img src={BlueMedalEmpty} alt="800-mdeal-empty" />
                    )}
                </div>
            </div>

            <div
                ref={playerNameContainerRef}
                className="ml-0 flex flex-1 flex-col overflow-hidden md:ml-12"
            >
                <div className="mt-4 flex h-20 items-center">
                    {!!steamProfile ? (
                        <div
                            ref={playerNameTextRef}
                            className="flex items-center text-7xl font-light"
                        >
                            <span
                                className="inline-block"
                                style={{ marginRight: playerNameFontSize / 3.6 }}
                            >
                                {steamProfile.personaname}
                            </span>
                            <PlayerFlag
                                style={{
                                    width: playerNameFontSize * 0.875,
                                    marginTop: playerNameFontSize / 6,
                                }}
                                nationality={steamProfile.loccountrycode}
                            />
                        </div>
                    ) : (
                        <Skeleton className="h-14 w-72" />
                    )}
                </div>
                <div ref={playerRankContainerRef} className="mt-2 flex h-12 items-center text-5xl">
                    <span ref={playerRankTextRef} className={playerProfileKZData?.rank.color}>
                        {!apiLoading ? (
                            playerProfileKZData ? (
                                playerProfileKZData.rank.label
                            ) : (
                                "UNKNOWN"
                            )
                        ) : (
                            <Skeleton className="h-10 w-48" />
                        )}
                    </span>
                </div>
                <div
                    ref={playerPointsContainerRef}
                    className="mt-2 flex h-12 items-center font-light text-foreground/60"
                >
                    <div ref={playerPointsTextRef}>
                        {!apiLoading ? (
                            <>
                                <span>
                                    {playerProfileKZData
                                        ? playerProfileKZData.points.total.toLocaleString()
                                        : parseFloat("0").toLocaleString()}
                                </span>
                                <span className="mx-2">•</span>
                                <span>
                                    (
                                    {playerProfileKZData
                                        ? playerProfileKZData.points.average.toFixed(2)
                                        : parseFloat("0").toFixed(2)}
                                    )
                                </span>
                            </>
                        ) : (
                            <Skeleton className="h-10 w-40" />
                        )}
                    </div>
                </div>
                {/*<div className="inline-flex mb-2 ">{PlayerRoles}</div>*/}
            </div>
        </div>
    )
}

export default PlayerInfo
