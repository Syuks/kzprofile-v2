import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Layout from "./pages/layout"
import PlayerSearch from "./pages/players/search"
import PlayerProfile from "./pages/players/[steamid]"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

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
