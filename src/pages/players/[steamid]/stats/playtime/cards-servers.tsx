import { useMemo } from "react"

import { DesktopIcon } from "@radix-ui/react-icons"

import { getTimeString } from "@/lib/utils"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Playtime_CardServersProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface ServerData {
    serverName: string
    serverPlaytime: number
    serverShortRunsCount: number
    serverLongRunsCount: number
}

interface ServersData {
    serverWithMostPlaytime: ServerData
    serverWithLeastPlaytime: ServerData
    serverWithMostShortRuns: ServerData
    serverWithMostLongRuns: ServerData
}

function Playtime_CardServers({ recordsTopStatistics }: Playtime_CardServersProps) {
    const serversData = useMemo<ServersData>(() => {
        const serversArray: ServerData[] = Object.entries(recordsTopStatistics.finishesPerServer)
            .map(([serverName, finishes]) => {
                const serverPlaytime = finishes
                    ? finishes.reduce((acc, finish) => {
                          return acc + finish.time
                      }, 0)
                    : 0

                const serverShortRunsCount = finishes.filter((finish) => finish.time < 120).length

                const serverLongRunsCount = finishes.filter((finish) => finish.time > 120).length

                return {
                    serverName,
                    serverPlaytime,
                    serverShortRunsCount,
                    serverLongRunsCount,
                }
            })
            .sort((serverA, serverB) => serverB.serverPlaytime - serverA.serverPlaytime)

        const serverWithMostShortRuns = [...serversArray].sort(
            (serverA, serverB) => serverB.serverShortRunsCount - serverA.serverShortRunsCount,
        )[0]

        const serverWithMostLongRuns = [...serversArray].sort(
            (serverA, serverB) => serverB.serverLongRunsCount - serverA.serverLongRunsCount,
        )[0]

        return {
            serverWithMostPlaytime: serversArray[0],
            serverWithLeastPlaytime: serversArray.slice(-1)[0],
            serverWithMostShortRuns,
            serverWithMostLongRuns,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with most playtime</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithMostPlaytime.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {getTimeString(serversData.serverWithMostPlaytime.serverPlaytime)}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Server with least playtime
                    </CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithLeastPlaytime.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {getTimeString(serversData.serverWithLeastPlaytime.serverPlaytime)}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Server with most short runs
                    </CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithMostShortRuns.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {serversData.serverWithMostShortRuns.serverShortRunsCount} runs under 2
                        minutes
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with most playtime</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithMostLongRuns.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {serversData.serverWithMostLongRuns.serverLongRunsCount} runs over 2 minutes
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Playtime_CardServers
