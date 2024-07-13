import { Outlet } from "react-router-dom"

import Header from "@/components/navbar/header"
import Footer from "@/components/footer"
import ModeChooser from "@/components/gamemode/game-mode-chooser"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

function Layout() {
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
