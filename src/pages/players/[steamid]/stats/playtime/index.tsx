import { RecordsTopStatistics } from "../stats"

import Playtime_CardRuns from "./cards-runs"
import Playtime_ChartDoughnutTiers from "./chart-doughnut-tiers"
import Playtime_ChartBarAverage from "./chart-bar-average"
import Playtime_CardDates from "./cards-dates"
import Playtime_ChartBubbleDays from "./chart-bubble-days"
import Playtime_CardMappers from "./cards-mappers"
import Playtime_TableMappers from "./table-mappers"
import Playtime_ChartBarMappers from "./chart-bar-mappers"
import Playtime_CardServers from "./cards-servers"
import Playtime_TableServers from "./table-servers"
import Playtime_ChartBarServers from "./chart-bar-servers"

interface Stats_PlaytimeProps {
    recordsTopStatistics: RecordsTopStatistics
}

function Stats_Playtime({ recordsTopStatistics }: Stats_PlaytimeProps) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Playtime_CardRuns recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Playtime_ChartDoughnutTiers
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Playtime_ChartBarAverage
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Playtime_CardDates recordsTopStatistics={recordsTopStatistics} />
            </div>

            <Playtime_ChartBubbleDays recordsTopStatistics={recordsTopStatistics} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Playtime_CardMappers recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Playtime_TableMappers
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Playtime_ChartBarMappers
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Playtime_CardServers recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Playtime_TableServers
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Playtime_ChartBarServers
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>
        </>
    )
}

export default Stats_Playtime
