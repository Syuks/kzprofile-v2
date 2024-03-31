import { useQuery } from "@tanstack/react-query"

import { GlobalAPI_GetRecordFilterDistributions } from "../../utils/APIs/GlobalAPI"
import { getGameModeID } from "../../utils/GOKZ"

const useMapDistributions = (mapID, gameMode, stage, queryOptions = {}) => {
    return useQuery(
        ["mapDistributions", mapID, gameMode, stage],
        async () => {
            const baseParams = {
                map_ids: mapID,
                mode_ids: getGameModeID(gameMode),
                stages: stage,
                limit: 1
            }

            const [proResponse, tpResponse] = await Promise.all([
                GlobalAPI_GetRecordFilterDistributions({...baseParams, has_teleports: false}),
                GlobalAPI_GetRecordFilterDistributions({...baseParams, has_teleports: true})
            ])
            
            // SOURCE: https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.burr12.html
            // c: shape of the curve (>0)
            // d: shape of the curve (>0)
            // loc: location of the curve. It's used to shift x (seconds, time) to where the curve starts (run times start)
            // scale: scale the curve (>0)
            
            // Hard cap: time limit in seconds (3 hours)
            const timeLimit = 3 * 60 * 60

            const burr12 = (x, c, d, loc, scale) => {
                // Shifting and scaling x accordingly
                const y = (x - loc) / scale
                return ( (c * d * Math.pow(y, c - 1)) / Math.pow(1 + Math.pow(y, c), d + 1) ) / scale
            }
            
            const burr12percentile = (x, c, d, loc, scale) => {
                // Shifting and scaling x accordingly
                const y = (x - loc) / scale
                return Math.pow(1 + Math.pow(y, c), -d)
            }

            const getChartDistributionData = (filterData) => {
                const { c, d, loc, scale } = filterData

                let chartData = {
                    percentile: [],
                    distribution: []
                }

                // Time is in seconds. Will be the x axis (>=0)
                for (let time = 0; time < timeLimit; time++) {

                    const percentile = burr12percentile(time, c, d, loc, scale)

                    // Soft cap, there are 0/almost 0 runs past this "time" (1+(y^c))^-d
                    if (percentile < 0.1) {
                        break
                    }

                    chartData.percentile.push({
                        x: time,
                        y: percentile
                    })
                    chartData.distribution.push({
                        x: time,
                        y: burr12(time, c, d, loc, scale),
                        percentile: percentile
                    })
                }

                return chartData
            }

            return {
                pro: proResponse.data.length ? getChartDistributionData(proResponse.data[0]) : { percentile: [], distribution: [] },
                tp: tpResponse.data.length ? getChartDistributionData(tpResponse.data[0]) : { percentile: [], distribution: [] }
            }
        },
        {
            ...queryOptions
        }
    )
}

export default useMapDistributions