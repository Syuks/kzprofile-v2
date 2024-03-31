import { useQuery } from "@tanstack/react-query"

import {
    GlobalAPI_GetRecordFilterDistributions,
    GetRecordFilterDistributionsParams,
} from "./APIs/GlobalAPI"
import { getGameModeID, GameMode } from "@/lib/gokz"

interface MapDistributions {
    record_filter_id: number
    c: number
    d: number
    loc: number
    scale: number
    top_scale: number
    created_on: string
    updated_on: string
    updated_by_id: string
}

interface ChartData {
    percentile: { x: number; y: number }[]
    distribution: { x: number; y: number; percentile: number }[]
}

const useMapDistributions = (mapID: number, gameMode: GameMode, stage: number) => {
    return useQuery({
        queryKey: ["mapDistributions", mapID, gameMode, stage],
        queryFn: async () => {
            // SOURCE: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.burr12.html
            // c: shape of the curve (>0)
            // d: shape of the curve (>0)
            // loc: location of the curve. It's used to shift x (seconds, time) to where the curve starts (run times start)
            // scale: scale the curve (>0)

            const burr12 = (
                x: number,
                c: number,
                d: number,
                loc: number,
                scale: number,
            ): number => {
                // Shifting and scaling x accordingly
                const y = (x - loc) / scale
                return (c * d * Math.pow(y, c - 1)) / Math.pow(1 + Math.pow(y, c), d + 1) / scale
            }

            const burr12percentile = (
                x: number,
                c: number,
                d: number,
                loc: number,
                scale: number,
            ): number => {
                // Shifting and scaling x accordingly
                const y = (x - loc) / scale
                return Math.pow(1 + Math.pow(y, c), -d)
            }

            const getChartDistributionData = (filterData: MapDistributions[]): ChartData => {
                let chartData: ChartData = {
                    percentile: [],
                    distribution: [],
                }

                if (!filterData.length) {
                    return chartData
                }

                // Hard cap: time limit in seconds (3 hours)
                const timeLimit = 3 * 60 * 60

                const { c, d, loc, scale } = filterData[0]

                // Time is in seconds. Will be the x axis (>=0)
                for (let time = 0; time < timeLimit; time++) {
                    const percentile = burr12percentile(time, c, d, loc, scale)

                    // Soft cap, there are 0/almost 0 runs past this "time" (1+(y^c))^-d
                    if (percentile < 0.1) {
                        break
                    }

                    chartData.percentile.push({
                        x: time,
                        y: percentile,
                    })
                    chartData.distribution.push({
                        x: time,
                        y: burr12(time, c, d, loc, scale),
                        percentile: percentile,
                    })
                }

                return chartData
            }

            const baseParams: GetRecordFilterDistributionsParams = {
                map_ids: [mapID],
                mode_ids: [getGameModeID(gameMode)],
                stages: [stage],
                limit: 1,
            }

            const [proResponse, tpResponse] = await Promise.all([
                GlobalAPI_GetRecordFilterDistributions({ ...baseParams, has_teleports: false }),
                GlobalAPI_GetRecordFilterDistributions({ ...baseParams, has_teleports: true }),
            ])

            const proJson: MapDistributions[] = await proResponse.json()
            const tpJson: MapDistributions[] = await tpResponse.json()

            return {
                pro: getChartDistributionData(proJson),
                tp: getChartDistributionData(tpJson),
            }
        },
    })
}

export default useMapDistributions
