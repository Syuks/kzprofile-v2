import { useEffect } from "react"

import {
    DiscordLogoIcon,
    EnterIcon,
    EnvelopeClosedIcon,
    ExitIcon,
    GitHubLogoIcon,
    PersonIcon,
} from "@radix-ui/react-icons"

import { Link, useNavigate } from "react-router-dom"

import { useLocalSettings } from "../localsettings/localsettings-provider"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function UserDropdown() {
    const [localSettings, setLocalSettings] = useLocalSettings()

    const navigate = useNavigate()

    const logout = () => {
        setLocalSettings({ steamPlayerSummary: undefined })
    }

    useEffect(() => {
        const profile = (e: KeyboardEvent) => {
            if (!localSettings.steamPlayerSummary) {
                return
            }

            if (
                (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLSelectElement
            ) {
                return
            }

            if (e.shiftKey && e.key === "P") {
                navigate(`/players/${localSettings.steamPlayerSummary.steamid}`)
            }
        }

        document.addEventListener("keydown", profile)
        return () => document.removeEventListener("keydown", profile)
    }, [localSettings])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage
                            src={localSettings.steamPlayerSummary?.avatarmedium}
                            alt="profile-pic"
                        />
                        <AvatarFallback className="bg-transparent">
                            <PersonIcon />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                {localSettings.steamPlayerSummary ? (
                    <>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {localSettings.steamPlayerSummary.personaname}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {localSettings.steamPlayerSummary.steamid}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link to={`/players/${localSettings.steamPlayerSummary.steamid}`}>
                                    Profile
                                    <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Settings
                                <DropdownMenuShortcut>⇧S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </>
                ) : (
                    <DropdownMenuItem asChild>
                        <Link to="/login">
                            Log in
                            <DropdownMenuShortcut>
                                <EnterIcon />
                            </DropdownMenuShortcut>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="https://github.com/Syuks/KZProfile" target="_blank" rel="noreferrer">
                        Github
                        <DropdownMenuShortcut>
                            <GitHubLogoIcon />
                        </DropdownMenuShortcut>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="https://www.discord.gg/csgokz" target="_blank" rel="noreferrer">
                        Discord
                        <DropdownMenuShortcut>
                            <DiscordLogoIcon />
                        </DropdownMenuShortcut>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to="mailto:syuks@kzprofile.com">
                        Support
                        <DropdownMenuShortcut>
                            <EnvelopeClosedIcon />
                        </DropdownMenuShortcut>
                    </Link>
                </DropdownMenuItem>
                {localSettings.steamPlayerSummary && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={logout}>
                            Log out{" "}
                            <DropdownMenuShortcut>
                                <ExitIcon />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown
