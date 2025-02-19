import { PlusCircledIcon } from "@radix-ui/react-icons"

import { Column, FilterFn, filterFns } from "@tanstack/react-table"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DebouncedInput } from "@/components/ui/debounced-input"

interface DatatableFacetedMinMaxFilter<TData, TValue> {
    column: Column<TData, TValue> | undefined
    title: string
    min?: number
    max?: number
    numberFormater?: (value: number | undefined) => string
}

export function DatatableFacetedMinMaxFilter<TData, TValue>({
    column,
    title,
    min,
    max,
    numberFormater,
}: DatatableFacetedMinMaxFilter<TData, TValue>) {
    if (!column) {
        return null
    }

    // Filter function "inNumberRange" = [min, max]
    const columnFilterValue = column.getFilterValue() as [number, number] | undefined
    const minValue = min ?? Number(column.getFacetedMinMaxValues()?.[0])
    const maxValue = max ?? Number(column.getFacetedMinMaxValues()?.[1])

    const badgeMin = () => {
        if (!columnFilterValue?.[0]) {
            return ""
        }

        if (!!numberFormater) {
            return numberFormater(columnFilterValue[0])
        }

        return columnFilterValue[0]
    }

    const badgeMax = () => {
        if (!columnFilterValue?.[1]) {
            return ""
        }

        if (!!numberFormater) {
            return numberFormater(columnFilterValue[1])
        }

        return columnFilterValue[1]
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    {title}
                    {!!columnFilterValue && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                {badgeMin()} • {badgeMax()}
                            </Badge>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
                <div className="p-4">
                    <div className="mb-3 space-y-2">
                        <h4 className="font-medium leading-none">{title} filter</h4>
                        <p className="text-sm text-muted-foreground">Set min and max values.</p>
                    </div>

                    <div className="grid gap-2">
                        <div className="grid grid-cols-5 items-center gap-4">
                            <span>Min</span>
                            <DebouncedInput
                                type="number"
                                min={minValue}
                                max={maxValue}
                                debounce={0}
                                value={columnFilterValue?.[0] ?? ""}
                                onChange={(value) =>
                                    column.setFilterValue((old: [number, number] | undefined) => [
                                        value,
                                        old?.[1],
                                    ])
                                }
                                placeholder={`Min (${minValue})`}
                                className="col-span-4 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            <span></span>
                            {!!numberFormater && (
                                <span className="col-span-4 text-sm text-muted-foreground">
                                    {numberFormater(columnFilterValue?.[0])}
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-5 items-center gap-4">
                            <span>Max</span>
                            <DebouncedInput
                                type="number"
                                min={minValue}
                                max={maxValue}
                                debounce={0}
                                value={columnFilterValue?.[1] ?? ""}
                                onChange={(value) =>
                                    column.setFilterValue((old: [number, number] | undefined) => [
                                        old?.[0],
                                        value,
                                    ])
                                }
                                placeholder={`Max (${maxValue})`}
                                className="col-span-4 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-4">
                            <span></span>
                            {!!numberFormater && (
                                <span className="col-span-4 text-sm text-muted-foreground">
                                    {numberFormater(columnFilterValue?.[1])}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {!!columnFilterValue && (
                    <>
                        <Separator />
                        <div className="p-1">
                            <Button
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

export const arrayLengthFilterFn: FilterFn<any> = (
    row,
    columnId: string,
    filterValue: [number, number],
) => {
    let [min, max] = filterValue

    const rowValue = row.getValue<string[]>(columnId).length
    return rowValue >= min && rowValue <= max
}

arrayLengthFilterFn.resolveFilterValue = filterFns.inNumberRange.resolveFilterValue
arrayLengthFilterFn.autoRemove = filterFns.inNumberRange.autoRemove
