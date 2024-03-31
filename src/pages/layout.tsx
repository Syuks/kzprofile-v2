import { Outlet } from "react-router-dom"

import Header from "@/components/navbar/header"

function Layout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default Layout
