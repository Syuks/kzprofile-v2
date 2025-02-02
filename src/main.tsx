import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { LocalSettingsProvider } from "@/components/localsettings/localsettings-provider"

import Layout from "./pages/layout"

import PlayerSearch from "./pages/players/search"

import PlayerProfile from "./pages/players/[steamid]"
import Finishes from "./pages/players/[steamid]/finishes"
import Unfinishes from "./pages/players/[steamid]/unfinishes"
import Jumpstats from "./pages/players/[steamid]/jumpstats"
import Stats from "./pages/players/[steamid]/stats/stats"
import Achievements from "./pages/players/[steamid]/achievements/achievements"

import Maps from "./pages/maps"
import MapLayout from "./pages/maps/[map-name]"
import MapLeaderboard from "./pages/maps/[map-name]/leaderboard"
import MapMedia from "./pages/maps/[map-name]/media"
import MapStats from "./pages/maps/[map-name]/stats/stats"

import Login from "./pages/login"

import Servers from "./pages/servers"

import Bans from "./pages/bans"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    TimeScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Filler,
    Title,
    Tooltip,
    Legend,
} from "chart.js"
import "chartjs-adapter-date-fns"

ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    TimeScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Filler,
    Title,
    Tooltip,
    Legend,
)

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
})

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "players",
                children: [
                    {
                        index: true,
                        element: <PlayerSearch />,
                    },
                    {
                        path: ":steamid",
                        element: <PlayerProfile />,
                        children: [
                            {
                                index: true,
                                element: <Finishes />,
                            },
                            {
                                path: "unfinishes",
                                element: <Unfinishes />,
                            },
                            {
                                path: "jumpstats",
                                element: <Jumpstats />,
                            },
                            {
                                path: "stats",
                                element: <Stats />,
                            },
                            {
                                path: "achievements",
                                element: <Achievements />,
                            },
                        ],
                    },
                ],
            },
            {
                path: "maps",
                children: [
                    {
                        index: true,
                        element: <Maps />,
                    },
                    {
                        path: ":mapName",
                        element: <MapLayout />,
                        children: [
                            {
                                index: true,
                                element: <MapLeaderboard />,
                            },
                            {
                                path: "media",
                                element: <MapMedia />,
                            },
                            {
                                path: "stats",
                                element: <MapStats />,
                            },
                        ],
                    },
                ],
            },
            {
                path: "servers",
                element: <Servers />,
            },
            {
                path: "bans",
                element: <Bans />,
            },
        ],
    },
    {
        path: "login",
        element: <Login />,
    },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <LocalSettingsProvider>
                <RouterProvider router={router} />
                <ReactQueryDevtools initialIsOpen={false} />
            </LocalSettingsProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
