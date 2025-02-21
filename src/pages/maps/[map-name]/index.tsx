import { useEffect, useMemo, useState, type PropsWithChildren } from "react"

import { BarChartIcon, DesktopIcon, TextAlignCenterIcon, VideoIcon } from "@radix-ui/react-icons"

import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query"
import { z } from "zod"

import { NavLink, useParams, Outlet, useSearchParams } from "react-router-dom"

import { cn } from "@/lib/utils"
import { TierData, getTierData } from "@/lib/gokz"
import { useGameMode, useRunType } from "@/components/localsettings/localsettings-provider"

import useKZProfileMap from "@/hooks/TanStackQueries/useKZProfileMap"
import { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"
import useMapTimes, { MapRecordsTop } from "@/hooks/TanStackQueries/useMapTimes"

import MapInfo from "./map-info"
import MapBanner from "./map-banner"

import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export interface MapLayoutOutletContext {
    mapName: string
    stage: number
    setStage: React.Dispatch<React.SetStateAction<number>>
    kzProfileMap: KZProfileMap | undefined
    kzProfileMapRefetch: () => void
    kzProfileMapFetching: boolean
    mapTierData: TierData | undefined
    mapTimesInfiniteQuery: UseInfiniteQueryResult<InfiniteData<MapRecordsTop[], unknown>, Error>
}

function MapLayout() {
    const { mapName } = useParams() as { mapName: string }

    useEffect(() => {
        document.title = `${mapName} - KZ Profile`
    }, [mapName])

    const [gameMode] = useGameMode()
    const [runType] = useRunType()

    const [searchParams] = useSearchParams()
    const [stage, setStage] = useState<number>(() => {
        const value = searchParams.get("stage") || searchParams.get("bonus")

        const result = z.coerce.number().int().safeParse(value)
        if (result.success) {
            return Number(value)
        }

        return 0
    })

    const kzProfileMap = useKZProfileMap(mapName)

    const mapTierData = useMemo<TierData | undefined>(() => {
        if (!kzProfileMap.data) {
            return undefined
        }

        return getTierData(kzProfileMap.data.difficulty)
    }, [kzProfileMap.data])

    const mapTimesInfiniteQuery = useMapTimes(mapName, gameMode, runType, stage, 100)

    return (
        <>
            <MapBanner mapName={mapName} className="hidden md:block" />

            <MapInfo stage={stage} mapTierData={mapTierData} kzProfileMap={kzProfileMap.data} />

            <div className="flex justify-evenly space-x-2 sm:justify-start">
                <MapNavLink path="" end={true} border={mapTierData?.border}>
                    <TextAlignCenterIcon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Leaderboard</span>
                </MapNavLink>
                <MapNavLink path="media" border={mapTierData?.border}>
                    <VideoIcon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Media</span>
                </MapNavLink>
                <MapNavLink path="stats" border={mapTierData?.border}>
                    <BarChartIcon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Statistics</span>
                </MapNavLink>
                <MapNavLink path={`/servers?search=${mapName}`} border={mapTierData?.border}>
                    <DesktopIcon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Servers</span>
                </MapNavLink>
            </div>
            <Separator className={cn("my-4", mapTierData?.backgroundColor)} />
            <div className="py-10">
                <Outlet
                    context={
                        {
                            mapName: mapName,
                            stage: stage,
                            setStage: setStage,
                            kzProfileMap: kzProfileMap.data,
                            kzProfileMapRefetch: kzProfileMap.refetch,
                            kzProfileMapFetching: kzProfileMap.isFetching,
                            mapTierData: mapTierData,
                            mapTimesInfiniteQuery: mapTimesInfiniteQuery,
                        } satisfies MapLayoutOutletContext
                    }
                />
            </div>
        </>
    )
}

interface MapNavLinkProps {
    path: string
    border?: string
    end?: boolean | undefined
}

function MapNavLink({ path, border, end, children }: PropsWithChildren<MapNavLinkProps>) {
    return (
        <NavLink
            to={path}
            end={end}
            className={({ isActive }) =>
                cn(
                    isActive
                        ? buttonVariants({ variant: "outline", size: "icon" })
                        : buttonVariants({ variant: "ghost", size: "icon" }),
                    isActive && border,
                    "mt-1 sm:w-auto sm:px-4 sm:py-2",
                )
            }
        >
            {children}
        </NavLink>
    )
}

export default MapLayout
export { MapNavLink }
