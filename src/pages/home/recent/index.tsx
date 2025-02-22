import useRecentTimes from "@/hooks/TanStackQueries/useRecentTimes"

import WrCarousel from "./wr-carousel"
import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"
import { useMemo } from "react"

function Recent() {
    const [gameMode] = useGameMode()
    const [runType] = useRunType()

    const recentWrsQuery = useRecentTimes(gameMode, runType, 0, 20, undefined, 1)
    const recentTop100Query = useRecentTimes(gameMode, runType, 0, 20, undefined, undefined)

    const recentWrs = useMemo(() => {
        if (!recentWrsQuery.data) {
            return []
        }

        return recentWrsQuery.data
    }, [recentWrsQuery.data])

    const recentTop100 = useMemo(() => {
        if (!recentTop100Query.data) {
            return []
        }

        return recentTop100Query.data
    }, [recentTop100Query.data])

    return (
        <div className="py-10">
            <h2 className="mb-4 scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                Recent WRs
            </h2>
            <WrCarousel records={recentWrs} />
            <h2 className="mb-4 mt-20 scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                Recent top 100
            </h2>
            <WrCarousel records={recentTop100} />
        </div>
    )
}

export default Recent
