import {
    CheckCircledIcon,
    CrossCircledIcon,
    LapTimerIcon,
    PersonIcon,
    ReloadIcon,
    StopwatchIcon,
} from "@radix-ui/react-icons"

import { useOutletContext } from "react-router-dom"

import { PlayerProfileOutletContext } from "."

import { Bar, Radar, Line } from "react-chartjs-2"
import type { ChartOptions, ChartData } from "chart.js"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            borderWidth: 1,
            borderColor: "hsl(240 3.7% 15.9%)",
            backgroundColor: "hsl(240 10% 3.9%)",
            padding: 8,
            titleFont: { size: 14 },
            bodyFont: { size: 14 },
            caretSize: 0,
            displayColors: false,
        },
    },
}

const tierLabels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard", "Extreme", "Death"]

export const barData: ChartData<"bar"> = {
    labels: tierLabels,
    datasets: [
        {
            data: [82, 159, 155, 101, 35, 11, 0],
            borderRadius: 8,
            backgroundColor: [
                "hsl(120, 99%, 62%)",
                "hsl(90, 99%, 64%)",
                "hsl(55, 75%, 70%)",
                "hsl(41, 75%, 56%)",
                "hsl(0, 99%, 62%)",
                "hsl(0, 100%, 50%)",
                "hsl(294, 78%, 54%)",
            ],
        },
    ],
}

export const radarOptions: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        r: {
            min: 0,
            max: 100,
            grid: {
                color: "hsl(240 3.7% 15.9%)",
            },
            angleLines: {
                color: "hsl(240 3.7% 15.9%)",
            },
            ticks: {
                display: false,
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            borderWidth: 1,
            borderColor: "hsl(240 3.7% 15.9%)",
            backgroundColor: "hsl(240 10% 3.9%)",
            padding: 8,
            titleFont: { size: 14 },
            bodyFont: { size: 14 },
            caretSize: 0,
            displayColors: false,
        },
    },
}

export const radarData: ChartData<"radar"> = {
    labels: tierLabels,
    datasets: [
        {
            label: "Finishes",
            data: [67.77, 58.46, 64.85, 67.33, 53.85, 17.46, 0],
            backgroundColor: "hsla(212, 61%, 61%, 0.2)",
            borderColor: "hsla(212, 61%, 61%, 1)",
        },
    ],
}

export const barOptions2: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            min: 0,
            max: 100,
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            borderWidth: 1,
            borderColor: "hsl(240 3.7% 15.9%)",
            backgroundColor: "hsl(240 10% 3.9%)",
            padding: 8,
            titleFont: { size: 14 },
            bodyFont: { size: 14 },
            caretSize: 0,
            displayColors: false,
        },
    },
}

export const barData2: ChartData<"bar"> = {
    labels: tierLabels,
    datasets: [
        {
            label: "Finishes",
            data: [67.77, 58.46, 64.85, 67.33, 53.85, 17.46, 0],
            borderRadius: 8,
            backgroundColor: [
                "hsl(120, 99%, 62%)",
                "hsl(90, 99%, 64%)",
                "hsl(55, 75%, 70%)",
                "hsl(41, 75%, 56%)",
                "hsl(0, 99%, 62%)",
                "hsl(0, 100%, 50%)",
                "hsl(294, 78%, 54%)",
            ],
        },
    ],
}

const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: "time",
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            borderWidth: 1,
            borderColor: "hsl(240 3.7% 15.9%)",
            backgroundColor: "hsl(240 10% 3.9%)",
            padding: 8,
            titleFont: { size: 14 },
            bodyFont: { size: 14 },
            caretSize: 0,
            displayColors: false,
        },
    },
}

const lineData: ChartData<"line"> = {
    datasets: [
        {
            label: "Finishes",
            data: [
                {
                    x: new Date().getTime(),
                    y: 10,
                },
                {
                    x: new Date().getTime() + 3600000000,
                    y: 5,
                },
            ],
            backgroundColor: "hsla(212, 61%, 61%, 0.2)",
            borderColor: "hsla(212, 61%, 61%, 1)",
        },
    ],
}

const mapperLabels = ["Spider1", "p", "zPrince", "NykaN", "Cyclo", "nopey", ""]

export const mapperBarData: ChartData<"bar"> = {
    labels: mapperLabels,
    datasets: [
        {
            data: [32, 12, 6, 9, 2, 4, 0],
            borderRadius: 8,
            backgroundColor: [
                "hsl(120, 99%, 62%)",
                "hsl(90, 99%, 64%)",
                "hsl(55, 75%, 70%)",
                "hsl(41, 75%, 56%)",
                "hsl(0, 99%, 62%)",
                "hsl(0, 100%, 50%)",
                "hsl(294, 78%, 54%)",
            ],
        },
    ],
}

function Stats() {
    const { playerProfileKZDataRefetch, playerProfileKZDataFetching } =
        useOutletContext<PlayerProfileOutletContext>()

    return (
        <>
            <div className="mb-4 flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Statistics
                </h2>

                <Button
                    variant="outline"
                    onClick={() => playerProfileKZDataRefetch()}
                    disabled={playerProfileKZDataFetching}
                >
                    {playerProfileKZDataFetching ? (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ReloadIcon className="mr-2 h-4 w-4" />
                    )}
                    Reload
                </Button>
            </div>
            <Tabs defaultValue="completions" className="space-y-4 py-4">
                <TabsList>
                    <TabsTrigger value="completions">Completions</TabsTrigger>
                    <TabsTrigger value="progression">Progression</TabsTrigger>
                    <TabsTrigger value="playtime">Playtime</TabsTrigger>
                </TabsList>
                <TabsContent value="completions" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Maps finished</CardTitle>
                                <CheckCircledIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">684</div>
                                <p className="text-xs text-muted-foreground">Out of 1019 maps</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Maps unfinished
                                </CardTitle>
                                <CrossCircledIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">312</div>
                                <p className="text-xs text-muted-foreground">Out of 1019 maps</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Tier with most finishes
                                </CardTitle>
                                <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-csgo-green">Very Easy</div>
                                <p className="text-xs text-muted-foreground">125 finishes</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Most completed tier
                                </CardTitle>
                                <LapTimerIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-csgo-gold">Hard</div>
                                <p className="text-xs text-muted-foreground">86 %</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Finishes per tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Bar options={barOptions} data={barData} height={350} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Last finish per tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Map</TableHead>
                                            <TableHead>Points</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Tier</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="text-csgo-green">
                                                Very Easy
                                            </TableCell>
                                            <TableCell>bkz_apricity_v3</TableCell>
                                            <TableCell>980</TableCell>
                                            <TableCell>00:12:25.654</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-csgo-lime">Easy</TableCell>
                                            <TableCell>bkz_apricity_v3</TableCell>
                                            <TableCell>980</TableCell>
                                            <TableCell>00:12:25.654</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-csgo-yellow">
                                                Medium
                                            </TableCell>
                                            <TableCell>bkz_apricity_v3</TableCell>
                                            <TableCell>980</TableCell>
                                            <TableCell>00:12:25.654</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-csgo-gold">Hard</TableCell>
                                            <TableCell>bkz_apricity_v3</TableCell>
                                            <TableCell>980</TableCell>
                                            <TableCell>00:12:25.654</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-csgo-red">
                                                Very Hard
                                            </TableCell>
                                            <TableCell>bkz_apricity_v3</TableCell>
                                            <TableCell>980</TableCell>
                                            <TableCell>00:12:25.654</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-csgo-darkred">
                                                Extreme
                                            </TableCell>
                                            <TableCell>bkz_apricity_v3</TableCell>
                                            <TableCell>980</TableCell>
                                            <TableCell>00:12:25.654</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="text-csgo-orchid">
                                                Death
                                            </TableCell>
                                            <TableCell>bkz_apricity_v3</TableCell>
                                            <TableCell>980</TableCell>
                                            <TableCell>00:12:25.654</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Completion per tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Radar options={radarOptions} data={radarData} height={350} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Completion percentage per tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Bar options={barOptions2} data={barData2} height={350} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Day with most PBs
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">1d</div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">May 3rd, 2022</div>
                                <p className="text-xs text-muted-foreground">3 PBs</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Month with most PBs
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">30d</div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">July 2023</div>
                                <p className="text-xs text-muted-foreground">24 PBs</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Quarter with most PBs
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">90d</div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Q3 2023</div>
                                <p className="text-xs text-muted-foreground">125 PBs</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Year with most PBs
                                </CardTitle>
                                <div className="text-sm text-muted-foreground">360d</div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">2023</div>
                                <p className="text-xs text-muted-foreground">198 PBs</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Completion per tier</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Line options={lineOptions} data={lineData} height={350} />
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Most played mapper
                                </CardTitle>
                                <PersonIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Spider1</div>
                                <p className="text-xs text-muted-foreground">23 maps</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Most completed mapper
                                </CardTitle>
                                <PersonIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">NykaN</div>
                                <p className="text-xs text-muted-foreground">83%</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Least played mapper
                                </CardTitle>
                                <PersonIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">GameChaos</div>
                                <p className="text-xs text-muted-foreground">0 maps</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Least completed mapper
                                </CardTitle>
                                <PersonIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Spider1</div>
                                <p className="text-xs text-muted-foreground">1%</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Finishes by mapper</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table className="table-fixed">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mapper</TableHead>
                                            <TableHead>Finishes</TableHead>
                                            <TableHead>Unfinishes</TableHead>
                                            <TableHead>Completion</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Spider1</TableCell>
                                            <TableCell>23</TableCell>
                                            <TableCell>62</TableCell>
                                            <TableCell>30%</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Mapper with most finishes per tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Bar options={barOptions} data={mapperBarData} height={350} />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="playtime"></TabsContent>
                <TabsContent value="progression"></TabsContent>
            </Tabs>
        </>
    )
}

export default Stats

/*  Completions
    This tab should have all stats related with a map being completed or unfinished

    Card: Maps finished
    Card: Maps unfinished
    Card: Most played tier (by number of finishes)
    Card: Most completed tier (by %)

    Vertical Bar: Completions per tier
    Table: Last completion per tier
    
    Radar: Completions per tier
    Vertical/horizontal Bar stacked: % completions per tier

    Card: Day with most completions
    Card: Month with most completions
    Card: Quarter with most completions
    Card: Year with most completions

    Bubble: bubbles size = completions per day
    Horizontal line: average completions per day/month/year, so it's smooth and not a lot of spikes
        
    Card: Most completed mapper (by % and the one with most maps)
    Card: Most played mapper (by number of finishes)
    Card: Least completed mapper (by % and the one with most maps)
    Card: Least played mapper (by number of unfinishes)
    
    Table: Completions per mapper
    Vertical bar: most played mapper per tier

    Card: Server with most PBs
    Card: Server with most hard PBs (hard, very hard, extreme, death)
    Card: Server with most easy PBs (very easy, easy, medium)
    Card: Server with least PBs

    Table: PBs per server
    Vertical bar: server with most PBs per tier

    ---

    Playtime
    This tab should have all stats related with the times of each finish

    Card: Shortest run
    Card: Longest run
    Card: Number of short runs (runs under 2 minutes)
    Card: Nmber of long runs (runs over 2 minutes)

    Vertical Bar: Time spent in every tier
    Doughnut: Average time per tier

    Card: Day with most time played
    Card: Month with most time played
    Card: Quarter with most time played
    Card: Year with most time played

    Bubble: bubbles size = time per day
    Horizontal line: average time per day/month/year, so it's smooth and not a lot of spikes

    Card: Mapper with most time played (by % and the one with most maps)
    Card: Mapper with most short runs
    Card: Mapper with most long runs
    Card: Least played mapper

    Table: Time played per mapper
    Vertical bar: most played mapper per tier by time

    Card: Most played Server
    Card: Least played Server
    Card: Server with most short runs
    Card: Server with most long runs

    Table: Servers play time

    ---

    Progression
    This tab should have all stats related with the points of each finish

    Card: Total points
    Card: Map with most points
    Card: Map with least points
    Card: Tier with most points
    Card: Tier with most % of points (gotten vs available)

    Vertical Bar: Points per tier
    Radar: Points per tier normalized (limit is total points gettable per tier)

    Card: Rank
    Card: Next Rank
    Card: Points until next rank
    Card: Rank %

    Stepped Line: Rank progression through time
    
    Card: Number of Wrs
    Card: Number of 900s
    Card: Number of 800s
    Card: Number of Low points
    
    Vertical Bar: Finishes per 100 points
    Doughnut: Average points per tier (I DON'T KNOW ABOUT THIS ONE, MAYBE LEAVE THE VERTICAL BAR TAKE THE WHOLE ROW)

    Card: Most improved month
    Card: Most improved year
    Card: Most improved tier
    Card: Least improved tier

    Line: Points progression through time per tier and all

    Card: Average points
    Card: Tier with best average points
    Card: Tier with worst average points
    Card: Month with best average points

    Line: Average points through time per tier and all

    Card: Day with most points
    Card: Month with most points
    Card: Quarter with most points
    Card: Year with most points

    Bubble: bubbles size = points per day

    Card: Mapper with most points
    Card: Mapper with least points (different to zero)
    Card: Mapper with best average points
    Card: Mapper with most medals (1000s, 900s, 800s)

    Table: Points per mapper
    Vertical bar: mapper with most points per tier

    Card: Server with most points
    Card: Server with least points
    Card: Server with best average points
    Card: Server with most medals (1000s, 900s, 800s)

    Table: Points per Server

    ---

    teleports
    This tab should have all stats related with the teleports of each finish
*/
