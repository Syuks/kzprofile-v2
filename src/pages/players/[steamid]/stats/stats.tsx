import { useEffect, useMemo, useState } from "react"

import {
    CheckCircledIcon,
    CrossCircledIcon,
    DesktopIcon,
    LapTimerIcon,
    PersonIcon,
    ReloadIcon,
    StopwatchIcon,
} from "@radix-ui/react-icons"

import { lightFormat, format } from "date-fns"

import { useOutletContext } from "react-router-dom"

import { cn } from "@/lib/utils"
import { TierData, TierID, getPointsColor, getTierData, tierLabels } from "@/lib/gokz"
import { type RecordsTopExtended } from "@/hooks/TanStackQueries/usePlayerProfileKZData"
import { useLocalSettings, useRunType } from "@/components/localsettings/localsettings-provider"

import { PlayerProfileOutletContext } from ".."

import MapHoverCard from "@/components/maps/map-hover-card"

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

const mapperBarData: ChartData<"bar"> = {
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

const serverLabels = [
    "MDQ Servers",
    "House of Climb #1",
    "House of Climb #4",
    "Latam GOKZ",
    "Latam GOKZ",
    "Latam GOKZ",
    "",
]

const serverBarData: ChartData<"bar"> = {
    labels: serverLabels,
    datasets: [
        {
            data: [9, 6, 12, 15, 7, 1, 0],
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
    const [localSettings] = useLocalSettings()

    const { playerProfileKZData, playerProfileKZDataRefetch, playerProfileKZDataFetching } =
        useOutletContext<PlayerProfileOutletContext>()

    const [runType] = useRunType()

    const [mapsTotal, setMapsTotal] = useState(0)
    const [mapsFinished, setMapsFinished] = useState(0)
    const [mapsUnfinished, setMapsUnfinished] = useState(0)
    const [tierWithMostFinishes, setTierWithMostFinishes] = useState<
        { data: TierData; amount: number } | undefined
    >()
    const [tierWithFewerFinishes, setTierWithFewerFinishes] = useState<
        { data: TierData; amount: number } | undefined
    >()

    const finishesBarOptions = useMemo<ChartOptions<"bar">>(
        () => ({
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
        }),
        [],
    )

    const [finishesBarData, setFinishesBarData] = useState<ChartData<"bar">>({
        labels: tierLabels,
        datasets: [
            {
                label: "Finishes",
                data: [0, 0, 0, 0, 0, 0, 0],
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
    })

    const [lastFinishPerTier, setLastFinishPerTier] = useState<RecordsTopExtended[]>([])

    const [completionPercentage, setCompletionPercentage] = useState(0)
    const [incompletionPercentage, setIncompletionPercentage] = useState(0)
    const [mostCompletedTier, setMostCompletedTier] = useState<
        { data: TierData; percentage: number } | undefined
    >()
    const [leastCompletedTier, setLeastCompletedTier] = useState<
        { data: TierData; percentage: number } | undefined
    >()

    const completionRadarOptions = useMemo<ChartOptions<"radar">>(
        () => ({
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
        }),
        [],
    )

    const [completionRadarData, setCompletionRadarData] = useState<ChartData<"radar">>({
        labels: tierLabels,
        datasets: [
            {
                label: "Completion",
                data: [],
                backgroundColor: "hsla(212, 61%, 61%, 0.2)",
                borderColor: "hsla(212, 61%, 61%, 1)",
            },
        ],
    })

    const completionBarOptions = useMemo<ChartOptions<"bar">>(
        () => ({
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
        }),
        [],
    )

    const [completionBarData, setCompletionBarData] = useState<ChartData<"bar">>({
        labels: tierLabels,
        datasets: [
            {
                label: "Completion",
                data: [],
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
    })

    const [dayWithMostPBs, setDayWithMostPBs] = useState<
        { day: string; amount: number } | undefined
    >()
    const [monthWithMostPBs, setMonthWithMostPBs] = useState<
        { month: string; amount: number } | undefined
    >()
    const [quarterWithMostPBs, setQuarterWithMostPBs] = useState<
        { quarter: string; amount: number } | undefined
    >()
    const [yearWithMostPBs, setYearWithMostPBs] = useState<
        { year: string; amount: number } | undefined
    >()

    useEffect(() => {
        const finishesLength = playerProfileKZData.finishes[runType].length
        const unfinishesLength = playerProfileKZData.unfinishes[runType].length

        let finishes_per_tier = [0, 0, 0, 0, 0, 0, 0]
        let last_finish_per_tier: { [difficulty: number]: RecordsTopExtended } = {}

        let maps_per_tier = [0, 0, 0, 0, 0, 0, 0]

        function getDateInfo(dateString: string) {
            const date = new Date(dateString)
            const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            const month = `${date.getFullYear()}-${date.getMonth() + 1}`
            const quarter = `Q${Math.floor((date.getMonth() + 3) / 3)} ${date.getFullYear()}`
            const year = date.getFullYear()
            return { day, month, quarter, year }
        }

        let dayCounts: Record<string, number> = {}
        let monthCounts: Record<string, number> = {}
        let quarterCounts: Record<string, number> = {}
        let yearCounts: Record<string, number> = {}

        playerProfileKZData.finishes[runType].forEach((finish) => {
            finishes_per_tier[finish.difficulty - 1]++
            maps_per_tier[finish.difficulty - 1]++

            // Last finish per tier
            if (
                !last_finish_per_tier[finish.difficulty] ||
                new Date(finish.created_on) >
                    new Date(last_finish_per_tier[finish.difficulty].created_on)
            ) {
                last_finish_per_tier[finish.difficulty] = finish
            }

            // Dates with most finishes
            const { day, month, quarter, year } = getDateInfo(finish.created_on)

            dayCounts[day] = (dayCounts[day] || 0) + 1
            monthCounts[month] = (monthCounts[month] || 0) + 1
            quarterCounts[quarter] = (quarterCounts[quarter] || 0) + 1
            yearCounts[year] = (yearCounts[year] || 0) + 1
        })

        playerProfileKZData.unfinishes[runType].forEach((unfinish) => {
            maps_per_tier[unfinish.difficulty - 1]++
        })

        const completion_per_tier = finishes_per_tier.map((finishes, index) => {
            return (finishes / maps_per_tier[index]) * 100
        })

        setMapsTotal(finishesLength + unfinishesLength)
        setMapsFinished(finishesLength)
        setMapsUnfinished(unfinishesLength)
        setTierWithMostFinishes(() => {
            const most_finishes = Math.max(...finishes_per_tier)
            const tier_with_most_finishes_data = getTierData(
                (finishes_per_tier.indexOf(most_finishes) + 1) as TierID,
            )

            return {
                data: tier_with_most_finishes_data,
                amount: most_finishes,
            }
        })
        setTierWithFewerFinishes(() => {
            const fewer_finishes = Math.min(...finishes_per_tier)
            const tier_with_fewer_finishes_data = getTierData(
                (finishes_per_tier.indexOf(fewer_finishes) + 1) as TierID,
            )

            return {
                data: tier_with_fewer_finishes_data,
                amount: fewer_finishes,
            }
        })

        setFinishesBarData((oldData) => ({
            ...oldData,
            datasets: [{ ...oldData.datasets[0], data: finishes_per_tier }],
        }))

        setLastFinishPerTier(Object.values(last_finish_per_tier))

        setCompletionPercentage((finishesLength / (finishesLength + unfinishesLength)) * 100)
        setIncompletionPercentage((unfinishesLength / (finishesLength + unfinishesLength)) * 100)
        setMostCompletedTier(() => {
            const most_completed = Math.max(...completion_per_tier)
            const most_completed_tier_data = getTierData(
                (completion_per_tier.indexOf(most_completed) + 1) as TierID,
            )

            return {
                data: most_completed_tier_data,
                percentage: most_completed,
            }
        })
        setLeastCompletedTier(() => {
            const least_completed = Math.min(...completion_per_tier)
            const least_completed_tier_data = getTierData(
                (completion_per_tier.indexOf(least_completed) + 1) as TierID,
            )

            return {
                data: least_completed_tier_data,
                percentage: least_completed,
            }
        })

        setCompletionRadarData((oldData) => ({
            ...oldData,
            datasets: [{ ...oldData.datasets[0], data: completion_per_tier }],
        }))

        setCompletionBarData((oldData) => ({
            ...oldData,
            datasets: [{ ...oldData.datasets[0], data: completion_per_tier }],
        }))

        setDayWithMostPBs(() => {
            const maxDay = Object.keys(dayCounts).reduce((a, b) =>
                dayCounts[a] > dayCounts[b] ? a : b,
            )
            return {
                day: format(maxDay, "MMM do, yyyy"),
                amount: dayCounts[maxDay],
            }
        })
        setMonthWithMostPBs(() => {
            const maxMonth = Object.keys(monthCounts).reduce((a, b) =>
                monthCounts[a] > monthCounts[b] ? a : b,
            )
            return {
                month: format(maxMonth, "MMM yyyy"),
                amount: monthCounts[maxMonth],
            }
        })
        setQuarterWithMostPBs(() => {
            const maxQuarter = Object.keys(quarterCounts).reduce((a, b) =>
                quarterCounts[a] > quarterCounts[b] ? a : b,
            )
            return {
                quarter: maxQuarter,
                amount: quarterCounts[maxQuarter],
            }
        })
        setYearWithMostPBs(() => {
            const maxYear = Object.keys(yearCounts).reduce((a, b) =>
                yearCounts[a] > yearCounts[b] ? a : b,
            )
            return {
                year: maxYear,
                amount: yearCounts[maxYear],
            }
        })
    }, [playerProfileKZData, runType])

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
            <Tabs defaultValue="completion" className="space-y-4 py-4">
                <TabsList>
                    <TabsTrigger value="completion">Completion</TabsTrigger>
                    <TabsTrigger value="progression">Progression</TabsTrigger>
                    <TabsTrigger value="playtime">Playtime</TabsTrigger>
                </TabsList>
                <TabsContent value="completion" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Completion percentage
                                </CardTitle>
                                <CheckCircledIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {completionPercentage.toFixed(3)} %
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {mapsFinished}/{mapsTotal} maps
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Incompletion percentage
                                </CardTitle>
                                <CrossCircledIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {incompletionPercentage.toFixed(3)} %
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {mapsUnfinished}/{mapsTotal} maps
                                </p>
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
                                <div
                                    className={cn(
                                        "text-2xl font-bold",
                                        mostCompletedTier?.data.color,
                                    )}
                                >
                                    {mostCompletedTier?.data.label}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {mostCompletedTier &&
                                        `${mostCompletedTier.percentage.toFixed(3)} %`}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Least completed tier
                                </CardTitle>
                                <LapTimerIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={cn(
                                        "text-2xl font-bold",
                                        leastCompletedTier?.data.color,
                                    )}
                                >
                                    {leastCompletedTier?.data.label}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {leastCompletedTier &&
                                        `${leastCompletedTier.percentage.toFixed(3)} %`}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Completion per tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Radar
                                    options={completionRadarOptions}
                                    data={completionRadarData}
                                    height={350}
                                />
                            </CardContent>
                        </Card>
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Completion per tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Bar
                                    options={completionBarOptions}
                                    data={completionBarData}
                                    height={350}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Maps finished</CardTitle>
                                <CheckCircledIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mapsFinished}</div>
                                <p className="text-xs text-muted-foreground">
                                    Out of {mapsTotal} maps
                                </p>
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
                                <div className="text-2xl font-bold">{mapsUnfinished}</div>
                                <p className="text-xs text-muted-foreground">
                                    Out of {mapsTotal} maps
                                </p>
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
                                <div
                                    className={cn(
                                        "text-2xl font-bold",
                                        tierWithMostFinishes?.data.color,
                                    )}
                                >
                                    {tierWithMostFinishes?.data.label}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {tierWithMostFinishes &&
                                        `${tierWithMostFinishes.amount} finishes`}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Tier with fewer finishes
                                </CardTitle>
                                <StopwatchIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={cn(
                                        "text-2xl font-bold",
                                        tierWithFewerFinishes?.data.color,
                                    )}
                                >
                                    {tierWithFewerFinishes?.data.label}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {tierWithFewerFinishes &&
                                        `${tierWithFewerFinishes.amount} finishes`}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Finishes per tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Bar
                                    options={finishesBarOptions}
                                    data={finishesBarData}
                                    height={350}
                                />
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
                                            <TableHead>Tier</TableHead>
                                            <TableHead>Map</TableHead>
                                            <TableHead>Points</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lastFinishPerTier.map((finish) => {
                                            const tierData = getTierData(finish.difficulty)
                                            const pointsColor = getPointsColor(finish.points)
                                            const dateString = lightFormat(
                                                finish.created_on,
                                                localSettings.dateFormat,
                                            )

                                            return (
                                                <TableRow key={finish.id}>
                                                    <TableCell className={tierData.color}>
                                                        {tierData.label}
                                                    </TableCell>
                                                    <TableCell>
                                                        <MapHoverCard
                                                            mapId={finish.map_id}
                                                            mapName={finish.map_name}
                                                            className="h-7"
                                                        />
                                                    </TableCell>
                                                    <TableCell className={pointsColor}>
                                                        {finish.points}
                                                    </TableCell>
                                                    <TableCell>{dateString}</TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
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
                                <div className="text-2xl font-bold">{dayWithMostPBs?.day}</div>
                                <p className="text-xs text-muted-foreground">
                                    {dayWithMostPBs && `${dayWithMostPBs.amount} PBs`}
                                </p>
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
                                <div className="text-2xl font-bold">{monthWithMostPBs?.month}</div>
                                <p className="text-xs text-muted-foreground">
                                    {monthWithMostPBs && `${monthWithMostPBs.amount} PBs`}
                                </p>
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
                                <div className="text-2xl font-bold">
                                    {quarterWithMostPBs?.quarter}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {quarterWithMostPBs && `${quarterWithMostPBs.amount} PBs`}
                                </p>
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
                                <div className="text-2xl font-bold">{yearWithMostPBs?.year}</div>
                                <p className="text-xs text-muted-foreground">
                                    {yearWithMostPBs && `${yearWithMostPBs.amount} PBs`}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>PBs per day</CardTitle>
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
                                <Bar
                                    options={finishesBarOptions}
                                    data={mapperBarData}
                                    height={350}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Server with most PBs
                                </CardTitle>
                                <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">MDQ Servers</div>
                                <p className="text-xs text-muted-foreground">23 PBs</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Server with most easy PBs
                                </CardTitle>
                                <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">MDQ Servers</div>
                                <p className="text-xs text-muted-foreground">
                                    11 very easy, easy and medium PBs
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Server with most hard PBs
                                </CardTitle>
                                <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">MDQ Servers</div>
                                <p className="text-xs text-muted-foreground">
                                    12 hard, very hard, extreme and death PBs
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Server with least PBs
                                </CardTitle>
                                <DesktopIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">House of Climb</div>
                                <p className="text-xs text-muted-foreground">1 PB</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>PBs per server</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Server</TableHead>
                                            <TableHead>PBs</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>MDQ Servers</TableCell>
                                            <TableCell>23</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Server with most PBs per tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Bar
                                    options={finishesBarOptions}
                                    data={serverBarData}
                                    height={350}
                                />
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
