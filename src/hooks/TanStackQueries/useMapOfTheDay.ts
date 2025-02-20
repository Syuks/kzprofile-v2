import { useQuery, queryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"

import { fetchGlobalMaps } from "./useGlobalMaps"

function seededRandom(seed: number, min: number, max: number): number {
    const a = 1664525
    const c = 1013904223
    const m = 2 ** 32

    seed = (a * seed + c) % m
    return min + (seed % (max - min + 1))
}

const mapOfTheDayQueryOptions = (utcDateSeed: number) => {
    return queryOptions({
        queryKey: ["mapOfTheDay", utcDateSeed],
        queryFn: async () => {
            const globalMaps = await fetchGlobalMaps()
            return globalMaps[seededRandom(utcDateSeed, 0, globalMaps.length - 1)]
        },
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

const useMapOfTheDay = () => {
    const now = new Date()
    const utcDateSeed =
        now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate()

    return useQuery(mapOfTheDayQueryOptions(utcDateSeed))
}

const fetchMapOfTheDay = () => {
    const now = new Date()
    const utcDateSeed =
        now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate()

    return queryClient.fetchQuery(mapOfTheDayQueryOptions(utcDateSeed))
}

export default useMapOfTheDay
export { fetchMapOfTheDay }
