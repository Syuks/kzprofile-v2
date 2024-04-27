import { useMemo } from "react"

import { RecordsTopStatistics } from "../stats"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getTimeString } from "@/lib/utils"

interface Playtime_TableServersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

export interface ServerData {
    serverName: string
    serverPlaytime: number
}

function Playtime_TableServers({ recordsTopStatistics, className }: Playtime_TableServersProps) {
    const serversData = useMemo<ServerData[]>(() => {
        return Object.entries(recordsTopStatistics.finishesPerServer)
            .map(([serverName, finishes]) => {
                const serverPlaytime = finishes
                    ? finishes.reduce((acc, finish) => {
                          return acc + finish.time
                      }, 0)
                    : 0

                return {
                    serverName,
                    serverPlaytime,
                }
            })
            .sort((serverA, serverB) => serverB.serverPlaytime - serverA.serverPlaytime)
            .slice(0, 7)
    }, [recordsTopStatistics])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Playtime by server</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-3/4">Server</TableHead>
                            <TableHead className="text-right">Playtime</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {serversData.map((serverData, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell className="h-12 w-3/4 truncate">
                                        {serverData.serverName}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {getTimeString(serverData.serverPlaytime)}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default Playtime_TableServers
