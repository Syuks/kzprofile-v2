import { RecordsTopStatistics } from "../stats"

import Completion_CardCompletion from "./cards-completion"
import Completion_CardFinishes from "./cards-finishes"
import Completion_CardDates from "./cards-dates"
import Completion_CardMappers from "./cards-mappers"
import Completion_CardServers from "./cards-servers"
import Completion_ChartRadarCompletion from "./chart-radar-completion"
import Completion_ChartBarCompletion from "./chart-bar-completion"
import Completion_ChartBarFinishes from "./chart-bar-finishes"
import Completion_TableLastFinish from "./table-last-finish"
import Completion_ChartScatterDays from "./chart-scatter-days"
import Completion_TableMappers from "./table-mappers"
import Completion_ChartBarMappers from "./chart-bar-mappers"
import Completion_TableServers from "./table-servers"
import Completion_ChartBarServers from "./chart-bar-servers"

interface Stats_CompletionProps {
    recordsTopStatistics: RecordsTopStatistics
}

function Stats_Completion({ recordsTopStatistics }: Stats_CompletionProps) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Completion_CardCompletion recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Completion_ChartRadarCompletion
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Completion_ChartBarCompletion
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Completion_CardFinishes recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Completion_ChartBarFinishes
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Completion_TableLastFinish
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Completion_CardDates recordsTopStatistics={recordsTopStatistics} />
            </div>

            <Completion_ChartScatterDays recordsTopStatistics={recordsTopStatistics} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Completion_CardMappers recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Completion_TableMappers
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Completion_ChartBarMappers
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Completion_CardServers recordsTopStatistics={recordsTopStatistics} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Completion_TableServers
                    className="col-span-3"
                    recordsTopStatistics={recordsTopStatistics}
                />
                <Completion_ChartBarServers
                    className="col-span-4"
                    recordsTopStatistics={recordsTopStatistics}
                />
            </div>
        </>
    )
}

export default Stats_Completion
