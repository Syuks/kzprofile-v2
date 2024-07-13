import { useEffect, useState, useCallback } from "react"

import { ReloadIcon } from "@radix-ui/react-icons"
import { SteamIcon } from "@/components/icons"

import { Link, useSearchParams, useNavigate } from "react-router-dom"

import { fetchSteamProfiles } from "@/hooks/TanStackQueries/useSteamProfiles"
import { useLocalSettings } from "@/components/localsettings/localsettings-provider"
import { getSteam64 } from "@/lib/steamid"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

function LoginForm() {
    const [_localSettings, setLocalSettings] = useLocalSettings()

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [steamID, setSteamID] = useState(() => {
        const claimed_id = searchParams.get("openid.claimed_id")

        if (!claimed_id) {
            return ""
        }

        return claimed_id.substring(37)
    })

    const [isLoading, setIsLoading] = useState(false)

    const logIn = useCallback(async () => {
        setIsLoading(true)

        const steam64 = getSteam64(steamID)

        if (!steam64) {
            toast("Invalid Steam ID.", {
                description: "Please check your Steam ID.",
            })
            setIsLoading(false)
            return
        }

        const steamProfiles = await fetchSteamProfiles([steam64])

        if (!steamProfiles || !steamProfiles.length) {
            toast("Could not retrieve the Steam profile.", {
                description: "Please check your Steam ID.",
            })
            setIsLoading(false)
            return
        }

        setLocalSettings({ steamPlayerSummary: steamProfiles[0] })
        setIsLoading(false)
        navigate("/")
    }, [steamID])

    const steamOpenID =
        "https://steamcommunity.com/openid/login?" +
        "openid.ns=http://specs.openid.net/auth/2.0&" +
        "openid.mode=checkid_setup&" +
        `openid.return_to=${window.location.protocol}//${window.location.host}/login?` +
        `openid.realm=${window.location.protocol}//${window.location.host}&` +
        "openid.ns.sreg=http://openid.net/extensions/sreg/1.1&" +
        "openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&" +
        "openid.identity=http://specs.openid.net/auth/2.0/identifier_select"

    useEffect(() => {
        const claimed_id = searchParams.get("openid.claimed_id")

        if (!claimed_id) {
            return
        }

        logIn()
    }, [searchParams])

    return (
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your{" "}
                    <Link
                        to="https://steamid.io/"
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Steam ID
                    </Link>{" "}
                    below to sync your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Steam ID
                        </Label>
                        <Input
                            id="steamid"
                            value={steamID}
                            onChange={(event) => setSteamID(event.target.value)}
                            placeholder="76561198267993933"
                            type="text"
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading} onClick={logIn}>
                        {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                        Log in with Steam ID
                    </Button>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <Button variant="outline" type="button" disabled={isLoading} asChild>
                    <Link to={steamOpenID}>
                        {isLoading ? (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <SteamIcon className="mr-2 h-4 w-4" />
                        )}{" "}
                        Steam
                    </Link>
                </Button>
            </div>
            <div className="px-8 text-center text-sm text-muted-foreground">
                <p>KZ Profile will not create an account.</p>
                <p>It only needs your Steam ID to gather your Steam profile's information.</p>
            </div>
        </div>
    )
}

export default LoginForm
