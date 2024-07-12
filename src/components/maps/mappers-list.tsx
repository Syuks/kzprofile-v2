import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MappersListProps {
    mapperNames: string[]
    mapperIds: string[]
}

function MappersList({ mapperNames, mapperIds }: MappersListProps) {
    // For testing:
    // 0 mappers: kz_de_bhop
    // 1 mapper: bkz_apricity_v3
    // 2 mappers: kz_communityjump3
    // 3 mappers: kz_11342
    // no id: kz_galaxy_go2

    return mapperNames.map((mapperName, index) => {
        if (index === 0) {
            return <MapperLink key={index} mapperName={mapperName} mapperId={mapperIds[index]} />
        }

        if (index === mapperNames.length - 1) {
            return (
                <>
                    {" & "}
                    <MapperLink key={index} mapperName={mapperName} mapperId={mapperIds[index]} />
                </>
            )
        }

        return (
            <>
                {", "}
                <MapperLink key={index} mapperName={mapperName} mapperId={mapperIds[index]} />
            </>
        )
    })
}

function MapperListSmall({ mapperNames, mapperIds }: MappersListProps) {
    if (mapperNames.length === 0) {
        return null
    }

    if (mapperNames.length === 1) {
        return <MapperLink mapperName={mapperNames[0]} mapperId={mapperIds[0]} className="h-auto" />
    }

    if (mapperNames.length === 2) {
        return (
            <>
                <MapperLink
                    mapperName={mapperNames[0]}
                    mapperId={mapperIds[0]}
                    className="h-auto"
                />
                {" & "}
                <MapperLink
                    mapperName={mapperNames[1]}
                    mapperId={mapperIds[1]}
                    className="h-auto"
                />
            </>
        )
    }

    if (mapperNames.length > 2) {
        return (
            <>
                <MapperLink
                    mapperName={mapperNames[0]}
                    mapperId={mapperIds[0]}
                    className="h-auto"
                />
                {` & ${mapperNames.length - 1} more`}
            </>
        )
    }

    return mapperNames.join(" & ")
}

interface MapperLinkProps {
    mapperName: string
    mapperId: string
    className?: string
}

function MapperLink({ mapperName, mapperId, className }: MapperLinkProps) {
    if (mapperId === "") {
        return mapperName
    }

    return (
        <Button asChild variant="link" className={cn("p-0", className)}>
            <Link to={`/players/${mapperId}`}>{mapperName}</Link>
        </Button>
    )
}

export { MappersList, MapperListSmall, MapperLink }
