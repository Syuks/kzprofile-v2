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

interface Progression_TableServersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

export interface ServerData {
    serverName: string
    serverPoints: number
}

function Progression_TableServers({
    recordsTopStatistics,
    className,
}: Progression_TableServersProps) {
    const serversData = useMemo<ServerData[]>(() => {
        return Object.entries(recordsTopStatistics.finishesPerServer)
            .map(([serverName, finishes]) => {
                const serverPoints = finishes
                    ? finishes.reduce((acc, finish) => {
                          return acc + finish.points
                      }, 0)
                    : 0

                return {
                    serverName,
                    serverPoints,
                }
            })
            .sort((serverA, serverB) => serverB.serverPoints - serverA.serverPoints)
            .slice(0, 7)
    }, [recordsTopStatistics])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Points by server</CardTitle>
            </CardHeader>
            <CardContent>
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-3/4">Server</TableHead>
                            <TableHead className="text-right">Points</TableHead>
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
                                        {serverData.serverPoints.toLocaleString()}
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

export default Progression_TableServers
