import GoldMedal from "@/assets/medals/1000.png"
import GoldMedalEmpty from "@/assets/medals/1000-empty.png"
import RedMedal from "@/assets/medals/900.png"
import RedMedalEmpty from "@/assets/medals/900-empty.png"
import BlueMedal from "@/assets/medals/800.png"
import BlueMedalEmpty from "@/assets/medals/800-empty.png"
import AvatarFrame from "@/assets/frames/frame1.png"

import type { SteamPlayerSummary } from "@/hooks/TanStackQueries/useSteamProfiles"
import type { PlayerProfileKZData } from "@/hooks/TanStackQueries/usePlayerProfileKZData"

//import PlayerFlag from '../../PlayerFlag/PlayerFlag'
//import Role from "../../Roles/Role"

//import { Badge } from 'primereact/badge'

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

    const WrMedalDiv = (
        <div className="md:order-0 relative order-1 mt-2">
            {playerProfileKZData.medals.gold > 0 ? (
                <>
                    <img src={GoldMedal} alt="WRs" />
                    <span className="wr-badge">{playerProfileKZData.medals.gold}</span>
                </>
            ) : (
                <img src={GoldMedalEmpty} alt="WRs" />
            )}
        </div>
    )

    const RedMedalDiv = (
        <div className="order-0 relative mt-[1.15rem] md:order-1">
            {playerProfileKZData.medals.red > 0 ? (
                <>
                    <img src={RedMedal} alt="900s" />
                    <span className="red-badge">{playerProfileKZData.medals.red}</span>
                </>
            ) : (
                <img src={RedMedalEmpty} alt="900s" />
            )}
        </div>
    )

    const BlueMedalDiv = (
        <div className="relative order-2 mt-[0.35rem]">
            {playerProfileKZData.medals.blue > 0 ? (
                <>
                    <img src={BlueMedal} alt="800s" />
                    <span className="blue-badge">{playerProfileKZData.medals.blue}</span>
                </>
            ) : (
                <img src={BlueMedalEmpty} alt="800s" />
            )}
        </div>
    )

    /*const PlayerRoles = playerProfile && playerProfile.roles.map(role=>{
        return (
            <Role roleID={role} key={role} />
        )
    })*/

    return (
        <div className="player-panel">
            <div className="picture-col">
                <div className="picture-div">
                    <a
                        href={`https://steamcommunity.com/profiles/${steamid}/`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="avatar-frame">
                            <img src={AvatarFrame} alt="frame" className="max-w-none" />
                        </div>
                        {steamProfile && (
                            <img
                                className="avatar-image"
                                src={steamProfile.avatar}
                                alt="playerAvatar"
                            ></img>
                        )}
                    </a>
                </div>
                <div className="socials-row">{/*PlayerSocials*/}</div>
            </div>

            <div className="medals-col">
                {WrMedalDiv}
                {RedMedalDiv}
                {BlueMedalDiv}
            </div>

            <div className="info-col">
                <div className="info-name">
                    {!steamProfile ? (
                        <span className="h-[50px] w-[300px] bg-[#0E0E0E]"></span>
                    ) : (
                        <>
                            <span>{steamProfile.personaname}</span>

                            <img
                                title={steamProfile.loccountrycode}
                                alt={steamProfile.loccountrycode}
                                src={`/flags/${steamProfile.loccountrycode.toUpperCase()}.png`}
                                onError={(e) => (e.currentTarget.src = `/flags/_unknown.png`)}
                            />
                        </>
                    )}
                </div>
                <div className="info-rank">
                    <span className={playerProfileKZData.rank.label}>
                        {playerProfileKZData.rank.label}
                    </span>
                </div>
                <div className="info-points">
                    `${playerProfileKZData.points.total.toLocaleString()} ($
                    {playerProfileKZData.points.average.toFixed(2)})`
                </div>
                <div className="info-roles">{/*PlayerRoles*/}</div>
            </div>
        </div>
    )
}

export default PlayerInfo
