import { GitHubLogoIcon, VideoIcon } from "@radix-ui/react-icons"

import { Link } from "react-router-dom"

import CommandMenu from "@/components/navbar/command-menu"
import MainNav from "@/components/navbar/main-nav"
import MobileNav from "@/components/navbar/mobile-nav"
import ThemeToggle from "@/components/theme/theme-toggle"

import { Button } from "@/components/ui/button"

function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center px-4 sm:px-8">
                <MainNav />
                <MobileNav />
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <CommandMenu />
                    </div>
                    <nav className="flex items-center">
                        <Button asChild variant="ghost" size="icon">
                            <Link
                                to="https://github.com/Syuks/KZProfile"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <GitHubLogoIcon className="h-4 w-4" />
                                <span className="sr-only">Github</span>
                            </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon">
                            <Link to="https://youtube.com/c/Syuks" target="_blank" rel="noreferrer">
                                <VideoIcon className="h-5 w-5" />
                                <span className="sr-only">YouTube</span>
                            </Link>
                        </Button>
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header
