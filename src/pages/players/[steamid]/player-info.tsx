import GoldMedal from "@/assets/medals/1000.png"
import GoldMedalEmpty from "@/assets/medals/1000-empty.png"
import RedMedal from "@/assets/medals/900.png"
import RedMedalEmpty from "@/assets/medals/900-empty.png"
import BlueMedal from "@/assets/medals/800.png"
import BlueMedalEmpty from "@/assets/medals/800-empty.png"
import AvatarFrame from "@/assets/frames/frame1.png"

import { Link } from "react-router-dom"

import type { SteamPlayerSummary } from "@/hooks/TanStackQueries/useSteamProfiles"
import type { PlayerProfileKZData } from "@/hooks/TanStackQueries/usePlayerProfileKZData"

import PlayerFlag from "@/components/flag/player-flag"
//import Role from "../../Roles/Role"

import { Badge } from "@/components/ui/badge"

interface PlayerInfoProps {
    steamid: string
    steamProfile: SteamPlayerSummary
    playerProfileKZData: PlayerProfileKZData
}

function PlayerInfo({ steamid, steamProfile, playerProfileKZData }: PlayerInfoProps) {
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

    return (
        <div className="flex-col md:inline-flex md:flex-row">
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
                        <img
                            className="h-full w-full rounded"
                            src={steamProfile.avatarfull}
                            alt="playerAvatar"
                        />
                    </Link>
                </div>
                {/*<div className="socials-row">{PlayerSocials}</div>*/}
            </div>

            <div className="my-4 flex flex-row items-center justify-around md:my-0 md:ml-12 md:flex-col">
                <div className="md:order-0 relative order-1 mt-2">
                    {playerProfileKZData.medals.gold > 0 ? (
                        <>
                            <img src={GoldMedal} alt="1000-medal" />
                            <Badge
                                variant="secondary"
                                className="bg-medals-gold pointer-events-none absolute left-[50px] top-[10px] px-2 text-white"
                            >
                                {playerProfileKZData.medals.gold}
                            </Badge>
                        </>
                    ) : (
                        <img src={GoldMedalEmpty} alt="1000-medal-emty" />
                    )}
                </div>
                <div className="order-0 relative mt-[1.15rem] md:order-1">
                    {playerProfileKZData.medals.red > 0 ? (
                        <>
                            <img src={RedMedal} alt="900-medal" />
                            <Badge
                                variant="secondary"
                                className="bg-medals-red pointer-events-none absolute left-[34px] top-0 px-2 text-white"
                            >
                                {playerProfileKZData.medals.red}
                            </Badge>
                        </>
                    ) : (
                        <img src={RedMedalEmpty} alt="900-medal-empty" />
                    )}
                </div>
                <div className="relative order-2 mt-[0.35rem]">
                    {playerProfileKZData.medals.blue > 0 ? (
                        <>
                            <img src={BlueMedal} alt="800-mdeal" />
                            <Badge
                                variant="secondary"
                                className="bg-medals-blue pointer-events-none absolute left-[34px] top-0 px-2 text-white"
                            >
                                {playerProfileKZData.medals.blue}
                            </Badge>
                        </>
                    ) : (
                        <img src={BlueMedalEmpty} alt="800-mdeal-empty" />
                    )}
                </div>
            </div>

            <div className="ml-0 md:ml-12">
                <div className="mt-4 text-7xl font-light">
                    <span className="mr-5 inline-block">{steamProfile.personaname}</span>
                    <PlayerFlag
                        className="inline-block"
                        nationality={steamProfile.loccountrycode}
                    />
                </div>
                <div className="mt-3 text-5xl">
                    <span className={playerProfileKZData.rank.color}>
                        {playerProfileKZData.rank.label}
                    </span>
                </div>
                <div className="mt-3 text-4xl font-light text-foreground/60">
                    {`${playerProfileKZData.points.total.toLocaleString()} • (${playerProfileKZData.points.average.toFixed(2)})`}
                </div>
                {/*<div className="inline-flex mb-2 ">{PlayerRoles}</div>*/}
            </div>
        </div>
    )
}

export default PlayerInfo
