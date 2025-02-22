import {
    GitHubLogoIcon,
    VideoIcon,
    EnvelopeClosedIcon,
    DiscordLogoIcon,
} from "@radix-ui/react-icons"
import { SteamIcon } from "@/components/icons"

import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

function Footer() {
    return (
        <footer className="border-t bg-secondary dark:bg-background">
            <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div>
                        <Link
                            to="/"
                            className="mr-6 inline-flex items-center justify-center space-x-3 lg:justify-start"
                        >
                            <img src="/favicon-32x32.png" className="h-5 w-5" />
                            <span className="font-bold">KZ Profile</span>
                        </Link>

                        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-muted-foreground lg:mx-0 lg:max-w-xs lg:text-left">
                            The perfect hub for all your CS:GO KZ stats, tools, and rankings. Track
                            progress, refine skills, and compete.
                        </p>

                        <div className="mt-8 flex justify-center gap-8 lg:justify-start">
                            <Button asChild variant="ghost" size="icon">
                                <Link
                                    to="https://github.com/Syuks/kzprofile-v2"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span className="sr-only">Github</span>
                                    <GitHubLogoIcon className="h-6 w-6" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon">
                                <Link
                                    to="https://steamcommunity.com/id/Syuks"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span className="sr-only">Steam</span>
                                    <SteamIcon className="h-6 w-6" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon">
                                <Link
                                    to="https://www.discord.gg/csgokz"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span className="sr-only">Steam</span>
                                    <DiscordLogoIcon className="h-6 w-6" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="icon">
                                <Link
                                    to="https://youtube.com/c/Syuks"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span className="sr-only">YouTube</span>
                                    <VideoIcon className="h-6 w-6" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">Players</p>

                            <ul className="mt-8 space-y-4 text-sm">
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link to="/players/76561198267993933">Profile</Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link to="/players">Player search</Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link to="/leaderboards">Leaderboards</Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link to="/bans">Bans</Link>
                                    </Button>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">Global API</p>

                            <ul className="mt-8 space-y-4 text-sm">
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link to="/maps">Maps</Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link to="/servers">Servers</Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link to="/">World records</Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link
                                            to="https://syuks.github.io/DistbugCalculator/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Distbug calculator
                                        </Link>
                                    </Button>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">Helpful Links</p>

                            <ul className="mt-8 space-y-4 text-sm">
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link
                                            to="https://forum.gokz.org/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Forums
                                        </Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link
                                            to="https://docs.gokz.org/"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Docs
                                        </Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link
                                            to="https://www.discord.gg/csgokz"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Discord
                                        </Link>
                                    </Button>
                                </li>
                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link
                                            to="https://www.youtube.com/watch?v=kqPFL90Gsls&list=PLMsUNSn0R-UaNdQ6oMnYUhc_eKsp85unH"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Tutorials
                                        </Link>
                                    </Button>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">Contact</p>

                            <ul className="mt-8 space-y-4 text-sm">
                                <li>
                                    <span className="pointer-events-none flex items-center justify-center sm:justify-start">
                                        <DiscordLogoIcon className="mr-2 h-4 w-4" />
                                        <span className="text-muted-foreground">syuks</span>
                                    </span>
                                </li>

                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link to="https://steamcommunity.com/id/Syuks">
                                            <SteamIcon className="mr-2 h-4 w-4" />
                                            <span className="text-muted-foreground">Syuks</span>
                                        </Link>
                                    </Button>
                                </li>

                                <li>
                                    <Button asChild variant="link" className="m-0 h-auto p-0">
                                        <Link to="mailto:syuks@kzprofile.com">
                                            <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
                                            <span className="text-muted-foreground">syuks</span>
                                        </Link>
                                    </Button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-muted-foreground pt-6">
                    <div className="text-center sm:flex sm:justify-between sm:text-left">
                        <p className="text-sm text-muted-foreground">
                            <span className="block sm:inline">All rights reserved. </span>

                            {/*<a
                                className="inline-block text-teal-600 underline transition hover:text-teal-600/75 dark:text-teal-500 dark:hover:text-teal-500/75"
                                href="#"
                            >
                                Terms & Conditions
                            </a>

                            <span>&middot;</span>

                            <a
                                className="inline-block text-teal-600 underline transition hover:text-teal-600/75 dark:text-teal-500 dark:hover:text-teal-500/75"
                                href="#"
                            >
                                Privacy Policy
                            </a>*/}
                        </p>

                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 sm:order-first sm:mt-0">
                            &copy; 2025 KZ Profile
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
