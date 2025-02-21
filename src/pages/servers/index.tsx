import { useEffect, useMemo, useState } from "react"

import {
    ClockIcon,
    GlobeIcon,
    MagnifyingGlassIcon,
    StarFilledIcon,
    ReloadIcon,
} from "@radix-ui/react-icons"

import { Link, Outlet, useSearchParams, useLocation, useNavigate } from "react-router-dom"

import MapBannerRandom from "@/components/maps/map-banner-random"
import { MapNavLink } from "@/pages/maps/[map-name]"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export interface ServersOutletContext {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

function Servers() {
    useEffect(() => {
        document.title = "Servers - KZ Profile"
    }, [])

    const [isLoading, setIsLoading] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = useMemo(() => {
        return (
            searchParams.get("search") ||
            searchParams.get("server") ||
            searchParams.get("map") ||
            searchParams.get("ip") ||
            searchParams.get("value") ||
            searchParams.get("query") ||
            ""
        )
    }, [searchParams])

    const [searchValue, setSearchValue] = useState(searchQuery)

    const [lastSearchValue, setLastSearchValue] = useState(searchValue)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        navigate("/servers")
        setSearchParams({ search: searchValue })
        setLastSearchValue(searchValue)
    }

    const routeColor = useMemo(() => {
        if (location.pathname === "/servers/favorites") return "bg-csgo-lime"
        if (location.pathname === "/servers/global") return "bg-csgo-red"
        return "bg-foreground"
    }, [location.pathname])

    return (
        <>
            <MapBannerRandom />
            <form
                className="mb-1.5 flex h-72 flex-col items-center justify-center space-y-6"
                onSubmit={handleSubmit}
            >
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Server search
                </h2>
                <div className="relative w-full max-w-xl">
                    <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="IP, IP:port, map"
                        className="border-foreground pl-8"
                        autoFocus
                        type="search"
                    />
                </div>
                <div className="flex space-x-12 pb-12">
                    <Button type="submit" disabled={isLoading}>
                        {!isLoading ? (
                            <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                        ) : (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Search
                    </Button>
                    <Button variant="secondary" type="button" asChild>
                        <Link to="global">
                            <ClockIcon className="mr-2 h-4 w-4" />
                            Global servers
                        </Link>
                    </Button>
                </div>
            </form>
            <div className="mb-4 flex flex-wrap justify-evenly space-x-2 sm:justify-start">
                <MapNavLink
                    path={`/servers${lastSearchValue ? `?search=${lastSearchValue}` : ""}`}
                    end={true}
                    border="border-foreground"
                >
                    <MagnifyingGlassIcon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Server search</span>
                </MapNavLink>
                <MapNavLink path="favorites" border="border-csgo-lime">
                    <StarFilledIcon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Favorites</span>
                </MapNavLink>
                <MapNavLink path="global" border="border-csgo-red">
                    <GlobeIcon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Global servers</span>
                </MapNavLink>
            </div>
            <Separator className={routeColor} />
            <Outlet context={{ setIsLoading } satisfies ServersOutletContext} />
        </>
    )
}

export default Servers
