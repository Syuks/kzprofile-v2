import { useState } from "react"

import { PlusCircledIcon } from "@radix-ui/react-icons"

import { format, isAfter, isBefore, isSameDay } from "date-fns"

import { Column, Row } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

type DateFilterMode = "before" | "after" | "equals"

type DateFilter = [DateFilterMode, Date[]]

export function dateFilterFunction<TValue>(row: Row<TValue>, id: string, dateFilter: DateFilter) {
    const rowDate = new Date(row.getValue<string>(id))

    const mode = dateFilter[0]
    const dates = dateFilter[1]

    if (mode === "before") {
        return isBefore(rowDate, dates[0])
    }

    if (mode === "after") {
        return isAfter(rowDate, dates[0])
    }

    // equals
    return dates.some((date: Date) => isSameDay(rowDate, date))
}

interface DataTableDateFilterProps<TData, TValue> {
    column: Column<TData, TValue> | undefined
    title: string
}

export function DataTableDateFilter<TData, TValue>({
    column,
    title,
}: DataTableDateFilterProps<TData, TValue>) {
    if (!column) {
        return null
    }

    const columnFilterValue = column.getFilterValue() as DateFilter | undefined

    const [mode, setMode] = useState<DateFilterMode>("equals")
    const dates = columnFilterValue?.[1] ?? []

    const FilterBadges = () => {
        if (mode === "equals") {
            return (
                <>
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                        {dates.length}
                    </Badge>
                    <div className="hidden space-x-1 lg:flex">
                        {dates.length > 2 ? (
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                {dates.length} selected
                            </Badge>
                        ) : (
                            dates.map((date) => (
                                <Badge
                                    variant="secondary"
                                    key={date.toString()}
                                    className="rounded-sm px-1 font-normal"
                                >
                                    {format(date, "MMM d, y")}
                                </Badge>
                            ))
                        )}
                    </div>
                </>
            )
        }

        return (
            <Badge variant="secondary" className="rounded-sm px-1 font-normal capitalize">
                {mode} {format(dates[0], "MMM d, y")}
            </Badge>
        )
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    {title}
                    {dates.length > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <FilterBadges />
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <RadioGroup
                    className="my-2 flex justify-evenly gap-0"
                    value={mode}
                    onValueChange={(newMode: DateFilterMode) => {
                        setMode(newMode)

                        // If there's any dates in the current filter, update the filter mode.
                        // Also, if the newMode is "before" or "after", trim the array to only the last date selected.
                        column.setFilterValue((oldDateFilter: DateFilter | undefined) =>
                            oldDateFilter?.[1].length
                                ? [
                                      newMode,
                                      newMode === "equals"
                                          ? oldDateFilter[1]
                                          : [oldDateFilter[1].pop()],
                                  ]
                                : undefined,
                        )
                    }}
                >
                    <>
                        <RadioGroupItem value="before" id="date-before" className="peer sr-only" />
                        <Label
                            htmlFor="date-before"
                            className={
                                mode === "before"
                                    ? buttonVariants({ variant: "secondary" })
                                    : buttonVariants({ variant: "ghost" })
                            }
                        >
                            Before
                        </Label>
                    </>
                    <>
                        <RadioGroupItem value="equals" id="date-equals" className="peer sr-only" />
                        <Label
                            htmlFor="date-equals"
                            className={
                                mode === "equals"
                                    ? buttonVariants({ variant: "secondary" })
                                    : buttonVariants({ variant: "ghost" })
                            }
                        >
                            Equals
                        </Label>
                    </>
                    <>
                        <RadioGroupItem value="after" id="date-after" className="peer sr-only" />
                        <Label
                            htmlFor="date-after"
                            className={
                                mode === "after"
                                    ? buttonVariants({ variant: "secondary" })
                                    : buttonVariants({ variant: "ghost" })
                            }
                        >
                            After
                        </Label>
                    </>
                </RadioGroup>
                <Separator />
                <Calendar
                    mode="multiple"
                    selected={dates}
                    max={mode !== "equals" ? 1 : Infinity}
                    onSelect={(selectedDates) =>
                        column.setFilterValue(() =>
                            selectedDates?.length ? [mode, selectedDates] : undefined,
                        )
                    }
                />
                {dates.length > 0 && (
                    <>
                        <Separator />
                        <div className="p-1">
                            <Button
                                onSelect={() => column.setFilterValue(undefined)}
                                className="w-full cursor-default justify-center text-center"
                                variant="ghost"
                                onClick={() => column.setFilterValue(undefined)}
                            >
                                Clear filters
                            </Button>
                        </div>
                    </>
                )}
            </PopoverContent>
        </Popover>
    )
}
