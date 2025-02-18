import { useMemo, useState } from "react"

import { ClockIcon, GlobeIcon, MagnifyingGlassIcon, StarFilledIcon } from "@radix-ui/react-icons"

import { Link, Outlet, useSearchParams, useLocation, useNavigate } from "react-router-dom"

import MapBannerRandom from "@/components/maps/map-banner-random"
import { MapNavLink } from "@/pages/maps/[map-name]"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

function Servers() {
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
                    <Button type="submit">
                        <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
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
            <div className="mb-4 space-x-2">
                <MapNavLink
                    path={`/servers${lastSearchValue ? `?search=${lastSearchValue}` : ""}`}
                    end={true}
                    border="border-foreground"
                >
                    <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
                    Server search
                </MapNavLink>
                <MapNavLink path="favorites" border="border-csgo-lime">
                    <StarFilledIcon className="mr-2 h-4 w-4" />
                    Favorites
                </MapNavLink>
                <MapNavLink path="global" border="border-csgo-red">
                    <GlobeIcon className="mr-2 h-4 w-4" />
                    Global servers
                </MapNavLink>
            </div>
            <Separator className={routeColor} />
            <Outlet />
        </>
    )
}

export default Servers
