import { useMemo } from "react"

import { format } from "date-fns"

import { RecordsTopStatistics, RecordTopStat } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Progression_CardDatesProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface DateData {
    date: string
    points: number
}

interface DatesData {
    dayWithMostPoints: DateData
    monthWithMostPoints: DateData
    quarterWithMostPoints: DateData
    yearWithMostPoints: DateData
}

function Progression_CardDates({ recordsTopStatistics }: Progression_CardDatesProps) {
    const datesData = useMemo<DatesData>(() => {
        const getDateData = (date: string, finishes: RecordTopStat[]): DateData => {
            const points = finishes.reduce((acc, finish) => {
                return acc + finish.points
            }, 0)

            return {
                date,
                points,
            }
        }

        const dayWithMostPoints: DateData = Object.entries(recordsTopStatistics.finishesPerDay)
            .map(([date, finishes]) => getDateData(date, finishes))
            .sort((dateA, dateB) => dateB.points - dateA.points)[0]

        const monthWithMostPoints: DateData = Object.entries(recordsTopStatistics.finishesPerMonth)
            .map(([date, finishes]) => getDateData(date, finishes))
            .sort((dateA, dateB) => dateB.points - dateA.points)[0]

        const quarterWithMostPoints: DateData = Object.entries(
            recordsTopStatistics.finishesPerQuarter,
        )
            .map(([date, finishes]) => getDateData(date, finishes))
            .sort((dateA, dateB) => dateB.points - dateA.points)[0]

        const yearWithMostPoints: DateData = Object.entries(recordsTopStatistics.finishesPerYear)
            .map(([date, finishes]) => getDateData(date, finishes))
            .sort((dateA, dateB) => dateB.points - dateA.points)[0]

        return {
            dayWithMostPoints: {
                date: format(dayWithMostPoints.date, "MMM do, yyyy"),
                points: dayWithMostPoints.points,
            },
            monthWithMostPoints: {
                date: format(monthWithMostPoints.date, "MMM yyyy"),
                points: monthWithMostPoints.points,
            },
            quarterWithMostPoints,
            yearWithMostPoints,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Day with most points</CardTitle>
                    <div className="text-sm text-muted-foreground">1d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {datesData.dayWithMostPoints.date}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {datesData.dayWithMostPoints.points.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Month with most points</CardTitle>
                    <div className="text-sm text-muted-foreground">30d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {datesData.monthWithMostPoints.date}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {datesData.monthWithMostPoints.points.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Quarter with most points</CardTitle>
                    <div className="text-sm text-muted-foreground">90d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {datesData.quarterWithMostPoints.date}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {datesData.quarterWithMostPoints.points.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Year with most points</CardTitle>
                    <div className="text-sm text-muted-foreground">360d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {datesData.yearWithMostPoints.date}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {datesData.yearWithMostPoints.points.toLocaleString()} points
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Progression_CardDates
