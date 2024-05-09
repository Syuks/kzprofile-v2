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
