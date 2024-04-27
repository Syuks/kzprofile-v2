import { useMemo } from "react"

import { format } from "date-fns"

import { RecordsTopStatistics, RecordTopStat } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getTimeString } from "@/lib/utils"

interface Playtime_CardDatesProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface DateData {
    date: string
    playtime: number
}

interface DatesData {
    dayWithMostPlaytime: DateData
    monthWithMostPlaytime: DateData
    quarterWithMostPlaytime: DateData
    yearWithMostPlaytime: DateData
}

function Playtime_CardDates({ recordsTopStatistics }: Playtime_CardDatesProps) {
    const datesData = useMemo<DatesData>(() => {
        const getDateData = (date: string, finishes: RecordTopStat[]): DateData => {
            const playtime = finishes.reduce((acc, finish) => {
                return acc + finish.time
            }, 0)

            return {
                date,
                playtime,
            }
        }

        const dayWithMostPlaytime: DateData = Object.entries(recordsTopStatistics.finishesPerDay)
            .map(([date, finishes]) => getDateData(date, finishes))
            .sort((dateA, dateB) => dateB.playtime - dateA.playtime)[0]

        const monthWithMostPlaytime: DateData = Object.entries(
            recordsTopStatistics.finishesPerMonth,
        )
            .map(([date, finishes]) => getDateData(date, finishes))
            .sort((dateA, dateB) => dateB.playtime - dateA.playtime)[0]

        const quarterWithMostPlaytime: DateData = Object.entries(
            recordsTopStatistics.finishesPerQuarter,
        )
            .map(([date, finishes]) => getDateData(date, finishes))
            .sort((dateA, dateB) => dateB.playtime - dateA.playtime)[0]

        const yearWithMostPlaytime: DateData = Object.entries(recordsTopStatistics.finishesPerYear)
            .map(([date, finishes]) => getDateData(date, finishes))
            .sort((dateA, dateB) => dateB.playtime - dateA.playtime)[0]

        return {
            dayWithMostPlaytime: {
                date: format(dayWithMostPlaytime.date, "MMM do, yyyy"),
                playtime: dayWithMostPlaytime.playtime,
            },
            monthWithMostPlaytime: {
                date: format(monthWithMostPlaytime.date, "MMM yyyy"),
                playtime: monthWithMostPlaytime.playtime,
            },
            quarterWithMostPlaytime,
            yearWithMostPlaytime,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Day with most playtime</CardTitle>
                    <div className="text-sm text-muted-foreground">1d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {datesData.dayWithMostPlaytime.date}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {getTimeString(datesData.dayWithMostPlaytime.playtime)} PB time
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Month with most playtime</CardTitle>
                    <div className="text-sm text-muted-foreground">30d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {datesData.monthWithMostPlaytime.date}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {getTimeString(datesData.monthWithMostPlaytime.playtime)} PB time
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Quarter with most playtime
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">90d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {datesData.quarterWithMostPlaytime.date}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {getTimeString(datesData.quarterWithMostPlaytime.playtime)} PB time
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Year with most playtime</CardTitle>
                    <div className="text-sm text-muted-foreground">360d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {datesData.yearWithMostPlaytime.date}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {getTimeString(datesData.yearWithMostPlaytime.playtime)} PB time
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Playtime_CardDates
