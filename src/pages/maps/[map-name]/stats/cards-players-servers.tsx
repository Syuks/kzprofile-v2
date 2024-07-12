import { useMemo } from "react"

import { DesktopIcon, PersonIcon } from "@radix-ui/react-icons"

import { useOutletContext } from "react-router-dom"
import { MapLayoutOutletContext } from ".."

import useMapWRs, { type RecordsTopRecent } from "@/hooks/TanStackQueries/useMapWRs"
import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import { MapperLink } from "@/components/maps/mappers-list"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface WRsData {
    playerMostWRs: {
        player: string
        steamid: string
        wrs: number
    }
    playerFewerWRs: {
        player: string
        steamid: string
        wrs: number
    }
    serverMostWRs: {
        server: string
        id: string
        wrs: number
    }
    serverFewerWRs: {
        server: string
        id: string
        wrs: number
    }
}

function Map_CardPlayersServers() {
    const [gameMode] = useGameMode()
    const [runType] = useRunType()
    const { mapName, stage } = useOutletContext<MapLayoutOutletContext>()

    const mapWRs = useMapWRs(mapName, gameMode, stage)

    const wrsData = useMemo<WRsData | undefined>(() => {
        if (!mapWRs.data || !mapWRs.data[runType].length) {
            return undefined
        }

        // PLAYERS
        let wrsPerPlayer: Record<string, RecordsTopRecent[]> = {}

        for (const wr of mapWRs.data[runType]) {
            wrsPerPlayer[wr.player_name] = wrsPerPlayer[wr.player_name] || []
            wrsPerPlayer[wr.player_name].push(wr)
        }

        const sortedPlayerWrsEntries = Object.entries(wrsPerPlayer).sort(
            ([_playerA, wrsA], [_playerB, wrsB]) => wrsB.length - wrsA.length,
        )

        const playerMostWRs = {
            player: sortedPlayerWrsEntries[0][0],
            steamid: sortedPlayerWrsEntries[0][1][0].steamid64,
            wrs: sortedPlayerWrsEntries[0][1].length,
        }

        const playerFewerWRs = {
            player: sortedPlayerWrsEntries[sortedPlayerWrsEntries.length - 1][0],
            steamid: sortedPlayerWrsEntries[sortedPlayerWrsEntries.length - 1][1][0].steamid64,
            wrs: sortedPlayerWrsEntries[sortedPlayerWrsEntries.length - 1][1].length,
        }

        // SERVERS
        let wrsPerServer: Record<string, RecordsTopRecent[]> = {}

        for (const wr of mapWRs.data[runType]) {
            wrsPerServer[wr.server_id] = wrsPerServer[wr.server_id] || []
            wrsPerServer[wr.server_id].push(wr)
        }

        const sortedServerWrsEntries = Object.entries(wrsPerServer).sort(
            ([_serverA, wrsA], [_serverB, wrsB]) => wrsB.length - wrsA.length,
        )

        const serverMostWRs = {
            server: sortedServerWrsEntries[0][1][0].server_name,
            id: sortedServerWrsEntries[0][0],
            wrs: sortedServerWrsEntries[0][1].length,
        }

        const serverFewerWRs = {
            server: sortedServerWrsEntries[sortedServerWrsEntries.length - 1][1][0].server_name,
            id: sortedServerWrsEntries[sortedServerWrsEntries.length - 1][0],
            wrs: sortedServerWrsEntries[sortedServerWrsEntries.length - 1][1].length,
        }

        return {
            playerMostWRs,
            playerFewerWRs,
            serverMostWRs,
            serverFewerWRs,
        }
    }, [mapWRs.data, runType])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Player with most WRs</CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {wrsData && (
                        <>
                            <MapperLink
                                mapperName={wrsData.playerMostWRs.player}
                                mapperId={wrsData.playerMostWRs.steamid}
                                className="truncate text-2xl font-bold"
                            />
                            <p className="text-xs text-muted-foreground">
                                {wrsData.playerMostWRs.wrs} WRs
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Player with fewer WRs</CardTitle>
                    <PersonIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {wrsData && (
                        <>
                            <MapperLink
                                mapperName={wrsData.playerFewerWRs.player}
                                mapperId={wrsData.playerFewerWRs.steamid}
                                className="truncate text-2xl font-bold"
                            />
                            <p className="text-xs text-muted-foreground">
                                {wrsData.playerFewerWRs.wrs} WRs
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with most WRs</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {wrsData && (
                        <>
                            <div className="truncate text-2xl font-bold">
                                {wrsData.serverMostWRs.server}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {wrsData.serverMostWRs.wrs} WRs
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with fewer WRs</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {wrsData && (
                        <>
                            <div className="truncate text-2xl font-bold">
                                {wrsData.serverFewerWRs.server}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {wrsData.serverFewerWRs.wrs} WRs
                            </p>
                        </>
                    )}
                </CardContent>
            </Card>
        </>
    )
}

export default Map_CardPlayersServers
