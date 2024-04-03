import { Outlet } from "react-router-dom"

import { LocalSettingsProvider } from "@/components/localsettings/localsettings-provider"

import Header from "@/components/navbar/header"
import ModeChooser from "@/components/gamemode/game-mode-chooser"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

function Layout() {
    return (
        <LocalSettingsProvider>
            <TooltipProvider>
                <Header />
                <ModeChooser />
                <div className="container">
                    <Outlet />
                </div>
                <Toaster />
            </TooltipProvider>
        </LocalSettingsProvider>
    )
}

export default Layout
