import { useMemo } from "react"

import { Link } from "react-router-dom"

import { useGameMode } from "@/components/localsettings/localsettings-provider"
import { fetchGlobalServerById } from "@/hooks/TanStackQueries/useGlobalServerById"
import { RecordsTopRecentWithSteamProfile } from "@/hooks/TanStackQueries/useRecentTimes"
import { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"

import { cn, getTimeString } from "@/lib/utils"
import { getGameModeID, getPointsColor } from "@/lib/gokz"

import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface MapOfTheDayLeaderboardProps {
    mapOfTheDay: KZProfileMap | undefined
    mapRecentTimes: RecordsTopRecentWithSteamProfile[]
    isLoading?: boolean
}

function MapOfTheDayLeaderboard({
    mapRecentTimes,
    isLoading,
    mapOfTheDay,
}: MapOfTheDayLeaderboardProps) {
    const [gameMode] = useGameMode()

    const mapHasFilter = useMemo(
        () => mapOfTheDay?.filters.includes(getGameModeID(gameMode)),
        [mapOfTheDay, gameMode],
    )

    const connectToServer = async (server_id: number) => {
        const globalServer = await fetchGlobalServerById(server_id)

        if (!globalServer) {
            toast.error("Global API", { description: "No server found with this ID." })
            return
        }

        window.location.replace(`steam://connect/${globalServer.ip}:${globalServer.port}`)
    }

    return (
        <div className="mx-auto md:w-[700px]">
            <Table className="table-fixed">
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-center">Time</TableHead>
                        <TableHead className="text-center">Points</TableHead>
                        <TableHead>Server</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mapOfTheDay && !mapHasFilter && (
                        <TableRow className="hover:bg-transparent">
                            <TableCell
                                colSpan={5}
                                className="text-center font-mono text-muted-foreground"
                            >
                                This map has no filters for this Game Mode.
                            </TableCell>
                        </TableRow>
                    )}
                    {isLoading
                        ? Array(5)
                              .fill({})
                              .map((_, index) => (
                                  <TableRow key={index} className="border-0 hover:bg-transparent">
                                      <TableCell colSpan={5}>
                                          <Skeleton className="h-9 w-full" />
                                      </TableCell>
                                  </TableRow>
                              ))
                        : mapRecentTimes.map((record) => (
                              <TableRow key={record.id} className="border-0 hover:bg-transparent">
                                  <TableCell>
                                      <img
                                          src={record.steamProfile.avatar}
                                          className="rounded-full"
                                      />
                                  </TableCell>
                                  <TableCell>
                                      <Button asChild variant="link" className="max-w-full px-0">
                                          <Link to={`/players/${record.steamid64}`}>
                                              <span className="truncate">{record.player_name}</span>
                                          </Link>
                                      </Button>
                                  </TableCell>
                                  <TableCell className="text-center">
                                      {getTimeString(record.time)}
                                  </TableCell>
                                  <TableCell
                                      className={cn("text-center", getPointsColor(record.points))}
                                  >
                                      {record.points}
                                  </TableCell>
                                  <TableCell>
                                      <Button
                                          variant="link"
                                          onClick={() => connectToServer(record.server_id)}
                                          className="max-w-full p-0"
                                      >
                                          <span className="truncate">{record.server_name}</span>
                                      </Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default MapOfTheDayLeaderboard
