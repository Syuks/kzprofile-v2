import { useEffect } from "react"

import { Outlet, useLocation } from "react-router-dom"

import Header from "@/components/navbar/header"
import Footer from "@/components/footer"
import ModeChooser from "@/components/gamemode/game-mode-chooser"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

function Layout() {
    const { pathname } = useLocation()

    useEffect(() => {
        // TODO: Find a way to prevent the browser from resetting the scroll position when going back.
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <TooltipProvider>
            <Header />
            <ModeChooser />
            <div className="container">
                <Outlet />
            </div>
            <Footer />
            <Toaster />
        </TooltipProvider>
    )
}

export default Layout
