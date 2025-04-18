import { Link, NavLink } from "react-router-dom"

import { cn } from "@/lib/utils"

function MainNav() {
    return (
        <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
                <img src="/favicon-32x32.png" className="mr-1 h-5 w-5" />
                <span className="hidden font-bold sm:inline-block">KZ Profile</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm lg:gap-6">
                <NavLink
                    to="/maps"
                    className={({ isActive }) =>
                        cn(
                            isActive ? "text-foreground" : "text-foreground/60",
                            "transition-colors hover:text-foreground/80",
                        )
                    }
                >
                    Maps
                </NavLink>
                <NavLink
                    to="/players"
                    className={({ isActive }) =>
                        cn(
                            isActive ? "text-foreground" : "text-foreground/60",
                            "transition-colors hover:text-foreground/80",
                        )
                    }
                >
                    Players
                </NavLink>
                <NavLink
                    to="/servers"
                    className={({ isActive }) =>
                        cn(
                            isActive ? "text-foreground" : "text-foreground/60",
                            "transition-colors hover:text-foreground/80",
                        )
                    }
                >
                    Servers
                </NavLink>
                <NavLink
                    to="/bans"
                    className={({ isActive }) =>
                        cn(
                            isActive ? "text-foreground" : "text-foreground/60",
                            "transition-colors hover:text-foreground/80",
                        )
                    }
                >
                    Bans
                </NavLink>
            </nav>
        </div>
    )
}

export default MainNav
