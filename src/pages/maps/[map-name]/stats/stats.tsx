import { useOutletContext } from "react-router-dom"

import { MapLayoutOutletContext } from ".."

import Map_CardWRs from "./cards-wrs"
import Map_ChartLineWrHistory from "./chart-line-wr-history"
import Map_CardPlayersServers from "./cards-players-servers"
import Map_ChartDoughnutPlayers from "./chart-doughnut-players"
import Map_ChartDoughnutServers from "./chart-doughnut-servers"
import Map_ChartLineDistribution from "./chart-line-distribution"
import Map_ChartLinePercentile from "./chart-line-percentile"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function MapStats() {
    const { kzProfileMap, stage, setStage } = useOutletContext<MapLayoutOutletContext>()

    return (
        <>
            <div className="mb-4 flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Statistics
                </h2>

                {/*<Button
                    variant="outline"
                    onClick={() => kzProfileMapRefetch()}
                    disabled={kzProfileMapFetching}
                >
                    {kzProfileMapFetching ? (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ReloadIcon className="mr-2 h-4 w-4" />
                    )}
                    Reload
                </Button>*/}
            </div>
            <div className="mb-52 mt-8 space-y-4">
                <div className="inline-block">
                    <Select
                        value={String(stage)}
                        onValueChange={(value: string) => setStage(Number(value))}
                    >
                        <SelectTrigger className="space-x-2 hover:bg-accent hover:text-accent-foreground">
                            <SelectValue placeholder="Select a stage" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="0">Main stage</SelectItem>
                                {!!kzProfileMap &&
                                    Array.from({ length: kzProfileMap.bonus_count }, (_, index) => (
                                        <SelectItem key={index + 1} value={String(index + 1)}>
                                            {`Bonus ${index + 1}`}
                                        </SelectItem>
                                    ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Map_CardWRs />
                </div>

                <Map_ChartLineWrHistory />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Map_CardPlayersServers />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                    <Map_ChartDoughnutPlayers className="col-span-4" />
                    <Map_ChartDoughnutServers className="col-span-4" />
                </div>

                <Map_ChartLineDistribution />

                <Map_ChartLinePercentile />
            </div>
        </>
    )
}

export default MapStats

/*  Card: Current WR
    Card: First clear
    Card: Longest standing WR
    Card: Fastest WR retake

    Stepped Line: WR History
    Table: WR History

    Card: Player with most WRs
    Card: Player with fewer WRs
    Card: Server with most WRs
    Card: Server with fewer WRs

    Bar: WRs per player
    Doughnut: WRs per server

    Average Distribution
    Top Percentile
*/
