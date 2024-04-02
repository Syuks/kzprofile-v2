import { Outlet } from "react-router-dom"

import { LocalSettingsProvider } from "@/components/localsettings/localsettings-provider"

import Header from "@/components/navbar/header"
import ModeChooser from "@/components/gamemode/game-mode-chooser"

import { Toaster } from "@/components/ui/sonner"

function Layout() {
    return (
        <LocalSettingsProvider>
            <Header />
            <ModeChooser />
            <Outlet />
            <Toaster />
        </LocalSettingsProvider>
    )
}

export default Layout
