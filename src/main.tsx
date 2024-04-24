import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Layout from "./pages/layout"
import PlayerSearch from "./pages/players/search"
import PlayerProfile from "./pages/players/[steamid]"
import Finishes from "./pages/players/[steamid]/finishes"
import Unfinishes from "./pages/players/[steamid]/unfinishes"
import Jumpstats from "./pages/players/[steamid]/jumpstats"
import Stats from "./pages/players/[steamid]/stats"

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
                        ],
                    },
                ],
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>,
)
