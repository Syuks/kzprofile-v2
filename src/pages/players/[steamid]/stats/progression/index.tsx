import { RecordsTopStatistics } from "../stats"

import Progression_CardPoints from "./cards-points"
import Progression_TableMapMostPoints from "./table-maps-most-points"
import Progression_TableMapFewerPoints from "./table-maps-fewer-points"
import Progression_CardTiers from "./cards-tiers"
import Progression_ChartBarTiers from "./chart-bar-tiers"
import Progression_ChartRadarTiers from "./chart-radar-tiers"
import Progression_CardRanks from "./cards-rank"
import Progression_ChartLineRank from "./chart-line-rank"
import Progression_CardMedals from "./cards-medals"
import Progression_ChartBarPoints from "./chart-bar-points"
import Progression_CardAverage from "./cards-average"
import Progression_ChartLineAverage from "./chart-line-average"
import Progression_ChartBarTiersAverage from "./chart-bar-tiers-average"
import Progression_TableAverage from "./table-average"
import Progression_CardDates from "./cards-dates"
import Progression_ChartLinePoints from "./chart-line-points"
import Progression_ChartBubbleDays from "./chart-bubble-days"
import Progression_CardMappers from "./cards-mappers"
import Progression_TableMappers from "./table-mappers"
import Progression_ChartBarMappers from "./chart-bar-mappers"
import Progression_CardServers from "./cards-servers"
import Progression_TableServers from "./table-servers"
import Progression_ChartBarServers from "./chart-bar-servers"

interface Stats_ProgressionProps {
    recordsTopStatistics: RecordsTopStatistics
}

function Stats_Progression({ recordsTopStatistics }: Stats_ProgressionProps) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Progression_CardPoints recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
                <Progression_TableMapMostPoints
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Progression_TableMapFewerPoints
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Progression_CardTiers recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Progression_ChartBarTiers
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Progression_ChartRadarTiers
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Progression_CardRanks recordsTopStatistics={recordsTopStatistics} />
            </div>

            <Progression_ChartLineRank recordsTopStatistics={recordsTopStatistics} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Progression_CardMedals recordsTopStatistics={recordsTopStatistics} />
            </div>

            <Progression_ChartBarPoints recordsTopStatistics={recordsTopStatistics} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Progression_CardAverage recordsTopStatistics={recordsTopStatistics} />
            </div>

            <Progression_ChartLineAverage recordsTopStatistics={recordsTopStatistics} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Progression_TableAverage
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Progression_ChartBarTiersAverage
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Progression_CardDates recordsTopStatistics={recordsTopStatistics} />
            </div>

            <Progression_ChartLinePoints recordsTopStatistics={recordsTopStatistics} />

            <Progression_ChartBubbleDays recordsTopStatistics={recordsTopStatistics} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Progression_CardMappers recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Progression_TableMappers
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Progression_ChartBarMappers
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Progression_CardServers recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Progression_TableServers
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Progression_ChartBarServers
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>
        </>
    )
}

export default Stats_Progression

/*
    Progression
    This tab should have all stats related with the points of each finish

    Card: Total points
    Card: Points completion
    Card: Map with most points
    Card: Map with fewer points

    Table: Maps with most points
    Table: Maps with fewer points

    Card: Tier with most points
    Card: Tier with fewer points
    Card: Best tier (tier with most % of points gotten vs available)
    Card: Worst tier (tier with least % of points gotten vs available)

    Vertical Bar: Points per tier
    Radar: Points per tier normalized (limit is total points gettable per tier)

    Card: Rank
    Card: Rank %
    Card: Next Rank
    Card: Points until next rank

    Stepped Line: Rank progression through time
    
    Card: Number of Wrs
    Card: Number of 900s
    Card: Number of 800s
    Card: Number of Low points
    
    Vertical Bar: Finishes per 100 points
    
    Card: Average points
    Card: Best average points all time
    Card: Tier with best average points
    Card: Tier with worst average points
    
    Line: Average points through time per tier and all
    
    Table: Best average points
    Bar: Average points per tier
    
    Card: Day with most points
    Card: Month with most points
    Card: Quarter with most points
    Card: Year with most points
    
    Line: Cumulative points through time per tier and all
    Bubble: bubbles size = points per day

    Card: Mapper with most points
    Card: Mapper with least points (different to zero)
    Card: Mapper with best average points
    Card: Mapper with most medals (1000s, 900s, 800s)

    Table: Points per mapper
    Vertical bar: mapper with most points per tier

    Card: Server with most points
    Card: Server with least points
    Card: Server with best average points
    Card: Server with most medals (1000s, 900s, 800s)

    Table: Points per Server
    Bar: Server with most points per tier
*/
