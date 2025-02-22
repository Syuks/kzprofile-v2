import { useCallback, useEffect, useState } from "react"

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

import { RecordsTopRecentWithSteamProfile } from "@/hooks/TanStackQueries/useRecentTimes"

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import WRCard from "./wr-card"

interface WRCarouselProps {
    records: RecordsTopRecentWithSteamProfile[]
}

function WrCarousel({ records }: WRCarouselProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const onSelect = useCallback((api: CarouselApi) => {
        if (!api) {
            return
        }

        setCanScrollPrev(api.canScrollPrev())
        setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = useCallback(() => {
        api?.scrollPrev()
    }, [api])

    const scrollNext = useCallback(() => {
        api?.scrollNext()
    }, [api])

    useEffect(() => {
        if (!api) {
            return
        }

        onSelect(api)
        api.on("reInit", onSelect)
        api.on("select", onSelect)

        return () => {
            api?.off("select", onSelect)
        }
    }, [api, onSelect])

    return (
        <Carousel className="w-full" setApi={setApi}>
            <CarouselContent>
                {records.map((record, index) => (
                    <CarouselItem
                        key={index}
                        className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                        <div className="flex-1">
                            <WRCard record={record} />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            {canScrollPrev && (
                <>
                    <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-background/90"></div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="group absolute left-0 top-1/2 h-full w-10 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
                        onClick={scrollPrev}
                    >
                        <ChevronLeftIcon className="h-10 w-10 transition-transform group-hover:scale-110" />
                    </Button>
                </>
            )}
            {canScrollNext && (
                <>
                    <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background/90"></div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="group absolute right-0 top-1/2 h-full w-10 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
                        onClick={scrollNext}
                    >
                        <ChevronRightIcon className="h-10 w-10 transition-transform group-hover:scale-110" />
                    </Button>
                </>
            )}
        </Carousel>
    )
}

export default WrCarousel
