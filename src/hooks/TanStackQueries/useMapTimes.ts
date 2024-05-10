import { useInfiniteQuery, infiniteQueryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetRecordsTop, GetRecordsTopParams } from "./APIs/GlobalAPI"

import { getGameModeName, type GameMode, type RunType } from "@/lib/gokz"

import { type RecordsTop } from "./usePlayerTimes"

export interface MapRecordsTop extends RecordsTop {
    place: number
}

const mapTimesInfiniteQueryOptions = (
    mapName: string,
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
) => {
    return infiniteQueryOptions({
        queryKey: ["mapTimes", mapName, gameMode, runType, stage, pageSize],
        queryFn: async ({ pageParam }) => {
            let params: GetRecordsTopParams = {
                map_name: mapName,
                modes_list_string: getGameModeName(gameMode),
                stage: stage,
                tickrate: 128,
                limit: pageSize,
                offset: pageParam,
            }

            if (runType === "pro") {
                params.has_teleports = false
            }

            if (runType === "tp") {
                params.has_teleports = true
            }

            if (runType === "nub") {
                params.overall = true
            }

            const response = await GlobalAPI_GetRecordsTop(params)
            const json: RecordsTop[] = await response.json()
            const mapJson: MapRecordsTop[] = json.map((record, index) => {
                return { ...record, place: index + 1 + pageParam }
            })
            return mapJson
        },
        initialPageParam: 0,
        getNextPageParam: (lastPageData, allPagesData) =>
            lastPageData.length === pageSize ? pageSize * allPagesData.length : undefined,
        gcTime: 0,
    })
}

const useMapTimes = (
    mapName: string,
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
) => {
    return useInfiniteQuery(
        mapTimesInfiniteQueryOptions(mapName, gameMode, runType, stage, pageSize),
    )
}

const fetchMapTimes = (
    mapName: string,
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
) => {
    return queryClient.fetchQuery(
        mapTimesInfiniteQueryOptions(mapName, gameMode, runType, stage, pageSize),
    )
}

const refetchMapTimes = (
    mapName: string,
    gameMode: GameMode,
    runType: RunType,
    stage: number,
    pageSize: number,
) => {
    const options = mapTimesInfiniteQueryOptions(mapName, gameMode, runType, stage, pageSize)

    queryClient.setQueryData(options.queryKey, (data) => ({
        pages: data ? data.pages.slice(0, 1) : [],
        pageParams: [0],
    }))

    queryClient.refetchQueries({ queryKey: options.queryKey })
}

export default useMapTimes
export { fetchMapTimes, refetchMapTimes }
