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

interface Completion_TableServersProps {
    recordsTopStatistics: RecordsTopStatistics
    className?: string
}

function Completion_TableServers({
    recordsTopStatistics,
    className,
}: Completion_TableServersProps) {
    const serversData = useMemo(() => {
        return Object.entries(recordsTopStatistics.finishesPerServer)
            .map(([serverName, finishes]) => {
                return {
                    serverName,
                    serverFinishesCount: finishes.length,
                }
            })
            .sort((serverA, serverB) => serverB.serverFinishesCount - serverA.serverFinishesCount)
            .slice(0, 7)
    }, [recordsTopStatistics])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>PBs per server</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Server</TableHead>
                            <TableHead className="text-right">PBs</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {serversData.map((serverData, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell className="h-12 truncate">
                                        {serverData.serverName}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {serverData.serverFinishesCount}
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

export default Completion_TableServers
