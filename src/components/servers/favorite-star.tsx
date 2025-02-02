import { useMemo } from "react"

import { StarIcon, StarFilledIcon } from "@radix-ui/react-icons"

import { useLocalSettings } from "@/components/localsettings/localsettings-provider"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface FavoriteStarProps {
    serverIp: string
}

function FavoriteStar({ serverIp }: FavoriteStarProps) {
    const [localSettings, setLocalSettings] = useLocalSettings()

    const isFavorite = useMemo(() => {
        if (!serverIp) return false

        return localSettings.favoriteServers.includes(serverIp)
    }, [localSettings.favoriteServers, serverIp])

    const onStarClick = () => {
        if (isFavorite) {
            //Remove it
            setLocalSettings({
                favoriteServers: localSettings.favoriteServers.filter(
                    (server) => server !== serverIp,
                ),
            })

            toast("Server removed from favorites.", {
                description: serverIp,
            })

            return
        }

        //Add it
        setLocalSettings({ favoriteServers: [...localSettings.favoriteServers, serverIp] })

        toast("Server added to favorites.", {
            description: serverIp,
        })
    }

    return (
        <Button variant="ghost" size="icon" className="rounded-full" onClick={onStarClick}>
            {isFavorite ? <StarFilledIcon /> : <StarIcon />}
        </Button>
    )
}

export default FavoriteStar
