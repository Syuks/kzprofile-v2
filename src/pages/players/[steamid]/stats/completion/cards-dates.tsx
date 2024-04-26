import { useMemo } from "react"

import { format } from "date-fns"

import { RecordsTopStatistics } from "../stats"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Completion_CardDatesProps {
    recordsTopStatistics: RecordsTopStatistics
}

interface DatesData {
    dayWithMostPBs: string
    dayWithMostPBsAmount: number
    monthWithMostPBs: string
    monthWithMostPBsAmount: number
    quarterWithMostPBs: string
    quarterWithMostPBsAmount: number
    yearWithMostPBs: string
    yearWithMostPBsAmount: number
}

function Completion_CardDates({ recordsTopStatistics }: Completion_CardDatesProps) {
    const datesData = useMemo<DatesData>(() => {
        const maxDay: string = Object.keys(recordsTopStatistics.finishesPerDay).reduce(
            (max, day) => {
                return recordsTopStatistics.finishesPerDay[day].length >
                    recordsTopStatistics.finishesPerDay[max].length
                    ? day
                    : max
            },
        )

        const maxMonth: string = Object.keys(recordsTopStatistics.finishesPerMonth).reduce(
            (max, month) => {
                return recordsTopStatistics.finishesPerMonth[month].length >
                    recordsTopStatistics.finishesPerMonth[max].length
                    ? month
                    : max
            },
        )

        const maxQuarter: string = Object.keys(recordsTopStatistics.finishesPerQuarter).reduce(
            (max, quarter) => {
                return recordsTopStatistics.finishesPerQuarter[quarter].length >
                    recordsTopStatistics.finishesPerQuarter[max].length
                    ? quarter
                    : max
            },
        )

        const maxYear: string = Object.keys(recordsTopStatistics.finishesPerYear).reduce(
            (max, year) => {
                return recordsTopStatistics.finishesPerYear[year].length >
                    recordsTopStatistics.finishesPerYear[max].length
                    ? year
                    : max
            },
        )

        return {
            dayWithMostPBs: format(maxDay, "MMM do, yyyy"),
            dayWithMostPBsAmount: recordsTopStatistics.finishesPerDay[maxDay].length,
            monthWithMostPBs: format(maxMonth, "MMM yyyy"),
            monthWithMostPBsAmount: recordsTopStatistics.finishesPerMonth[maxMonth].length,
            quarterWithMostPBs: maxQuarter,
            quarterWithMostPBsAmount: recordsTopStatistics.finishesPerQuarter[maxQuarter].length,
            yearWithMostPBs: maxYear,
            yearWithMostPBsAmount: recordsTopStatistics.finishesPerYear[maxYear].length,
        }
    }, [recordsTopStatistics])

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Day with most PBs</CardTitle>
                    <div className="text-sm text-muted-foreground">1d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">{datesData.dayWithMostPBs}</div>
                    <p className="text-xs text-muted-foreground">
                        {datesData.dayWithMostPBsAmount} PBs
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Month with most PBs</CardTitle>
                    <div className="text-sm text-muted-foreground">30d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">{datesData.monthWithMostPBs}</div>
                    <p className="text-xs text-muted-foreground">
                        {datesData.monthWithMostPBsAmount} PBs
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Quarter with most PBs</CardTitle>
                    <div className="text-sm text-muted-foreground">90d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">
                        {datesData.quarterWithMostPBs}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {datesData.quarterWithMostPBsAmount} PBs
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Year with most PBs</CardTitle>
                    <div className="text-sm text-muted-foreground">360d</div>
                </CardHeader>
                <CardContent>
                    <div className="truncate text-2xl font-bold">{datesData.yearWithMostPBs}</div>
                    <p className="text-xs text-muted-foreground">
                        {datesData.yearWithMostPBsAmount} PBs
                    </p>
                </CardContent>
            </Card>
        </>
    )
}

export default Completion_CardDates
