import { RecordsTopStatistics } from "../stats"

interface Stats_ProgressionProps {
    recordsTopStatistics: RecordsTopStatistics
}

function Stats_Progression({ recordsTopStatistics }: Stats_ProgressionProps) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"></div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"></div>
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

    Card: Tier with most points
    Card: Tier with fewer points
    Card: Best tier (tier with most % of points gotten vs available)
    Card: Worst tier (tier with least % of points gotten vs available)

    Vertical Bar: Points per tier
    Radar: Points per tier normalized (limit is total points gettable per tier)

    Card: Rank
    Card: Next Rank
    Card: Points until next rank
    Card: Rank %

    Stepped Line: Rank progression through time
    
    Card: Number of Wrs
    Card: Number of 900s
    Card: Number of 800s
    Card: Number of Low points
    
    Vertical Bar: Finishes per 100 points
    Doughnut: Average points per tier (I DON'T KNOW ABOUT THIS ONE, MAYBE LEAVE THE VERTICAL BAR TAKE THE WHOLE ROW)

    Card: Most improved month
    Card: Most improved year
    Card: Most improved tier
    Card: Least improved tier

    Line: Points progression through time per tier and all

    Card: Average points
    Card: Tier with best average points
    Card: Tier with worst average points
    Card: Month with best average points

    Line: Average points through time per tier and all

    Card: Day with most points
    Card: Month with most points
    Card: Quarter with most points
    Card: Year with most points

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
*/
