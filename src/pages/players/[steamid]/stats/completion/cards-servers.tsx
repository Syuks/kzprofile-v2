import { useMemo } from "react"

import { DesktopIcon } from "@radix-ui/react-icons"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Completion_CardServersProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface ServerData {
    serverName: string
    serverFinishesCount: number
    serverEasyFinishesCount: number
    serverHardFinishesCount: number
}

interface ServersData {
    serverWithMostPBs: ServerData
    serverWithMostEasyPBs: ServerData
    serverWithMostHardPBs: ServerData
    serverWithFewerPBs: ServerData
}

function Completion_CardServers({ recordsTopStatistics }: Completion_CardServersProps) {
    const serversData = useMemo<ServersData>(() => {
        const serverArray: ServerData[] = Object.keys(recordsTopStatistics.finishesPerServer)
            .map((serverName) => {
                const serverFinishesCount =
                    recordsTopStatistics.finishesPerServer[serverName].length
                const serverEasyFinishesCount = recordsTopStatistics.finishesPerServer[
                    serverName
                ].filter((finish) => [1, 2, 3].includes(finish.difficulty)).length
                const serverHardFinishesCount = recordsTopStatistics.finishesPerServer[
                    serverName
                ].filter((finish) => [4, 5, 6, 7].includes(finish.difficulty)).length

                return {
                    serverName,
                    serverFinishesCount,
                    serverEasyFinishesCount,
                    serverHardFinishesCount,
                }
            })
            .sort((serverA, serverB) => serverB.serverFinishesCount - serverA.serverFinishesCount)

        const serverWithMostPBs = serverArray[0]

        const serverWithMostEasyPBs = [...serverArray].sort((serverA, serverB) => {
            return serverB.serverEasyFinishesCount - serverA.serverEasyFinishesCount
        })[0]

        const serverWithMostHardPBs = [...serverArray].sort((serverA, serverB) => {
            return serverB.serverHardFinishesCount - serverA.serverHardFinishesCount
        })[0]

        const serverWithFewerPBs = serverArray.slice(-1)[0]

        return {
            serverWithMostPBs,
            serverWithMostEasyPBs,
            serverWithMostHardPBs,
            serverWithFewerPBs,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with most PBs</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithMostPBs.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {serversData.serverWithMostPBs.serverFinishesCount} PBs
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with most easy PBs</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithMostEasyPBs.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {serversData.serverWithMostEasyPBs.serverEasyFinishesCount} very easy, easy
                        and medium PBs
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with most hard PBs</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithMostHardPBs.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {serversData.serverWithMostHardPBs.serverHardFinishesCount} hard, very hard,
                        extreme and death PBs
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Server with fewer PBs</CardTitle>
                    <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {serversData.serverWithFewerPBs.serverName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {serversData.serverWithFewerPBs.serverFinishesCount} PBs
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Completion_CardServers
