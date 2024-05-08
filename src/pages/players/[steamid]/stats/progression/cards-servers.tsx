import { useMemo } from "react"

import { DesktopIcon } from "@radix-ui/react-icons"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Progression_CardServersProps {
    recordsTopStatistics: RecordsTopStatistics
}

export interface ServerData {
    serverName: string
    serverPoints: number
    serverAveragePoints: number
    serverMedalsCount: number
}

interface ServersData {
    serverWithMostPoints: ServerData
    serverWithFewerPoints: ServerData
    serverWithBestAveragePoints: ServerData
    serverWithMostMedals: ServerData
}

function Progression_CardServers({ recordsTopStatistics }: Progression_CardServersProps) {
    const serversData = useMemo<ServersData>(() => {
        const serversArray: ServerData[] = Object.entries(recordsTopStatistics.finishesPerServer)
            .map(([serverName, finishes]) => {
                const serverPoints = finishes
                    ? finishes.reduce((acc, finish) => {
                          return acc + finish.points
                      }, 0)
                    : 0

                const serverAveragePoints = serverPoints / (finishes.length || 1)

                const serverMedalsCount = finishes.filter((finish) => finish.points >= 800).length

                return {
                    serverName,
                    serverPoints,
                    serverAveragePoints,
                    serverMedalsCount,
                }
            })
            .sort((serverA, serverB) => serverB.serverPoints - serverA.serverPoints)

        const serverWithBestAveragePoints = [...serversArray].sort(
            (serverA, serverB) => serverB.serverAveragePoints - serverA.serverAveragePoints,
        )[0]

        const serverWithMostMedals = [...serversArray].sort(
            (serverA, serverB) => serverB.serverMedalsCount - serverA.serverMedalsCount,
        )[0]

        return {
            serverWithMostPoints: serversArray[0],
            serverWithFewerPoints: serversArray.slice(-1)[0],
            serverWithBestAveragePoints,
            serverWithMostMedals,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with most points</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithMostPoints.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {serversData.serverWithMostPoints.serverPoints.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with fewer points</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithFewerPoints.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {serversData.serverWithFewerPoints.serverPoints.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with best average</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithBestAveragePoints.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {serversData.serverWithBestAveragePoints.serverAveragePoints.toFixed(2)}{" "}
                        average
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with most medals</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithMostMedals.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {serversData.serverWithMostMedals.serverMedalsCount} medals
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Progression_CardServers
