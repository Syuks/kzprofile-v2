import { useState } from "react"

import { GitHubLogoIcon, VideoIcon } from "@radix-ui/react-icons"

import { Link, NavLink } from "react-router-dom"

import { HamburgerMenuIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

function MobileNav() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                    <HamburgerMenuIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <Link to="/" className="flex items-center">
                    <img src="/favicon-32x32.png" className="mr-2 h-5 w-5" />
                    <span className="font-bold">KZ Profile</span>
                </Link>
                <div className="mt-6 flex flex-col space-y-3">
                    <NavLink
                        to="/profile"
                        className={({ isActive }) =>
                            cn(
                                isActive ? "text-foreground" : "text-foreground/60",
                                "transition-colors hover:text-foreground/80",
                            )
                        }
                    >
                        Profile
                    </NavLink>
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
                        to="/test"
                        className={({ isActive }) =>
                            cn(
                                isActive ? "text-foreground" : "text-foreground/60",
                                "transition-colors hover:text-foreground/80",
                            )
                        }
                    >
                        Test
                    </NavLink>
                </div>
                <div className="mt-6 flex flex-col space-y-3">
                    <h4 className="font-medium">Socials</h4>
                    <Button asChild variant="link" className="justify-start">
                        <Link to="https://github.com/Syuks/KZProfile">
                            <GitHubLogoIcon className="mr-2 h-4 w-4" />
                            Github
                        </Link>
                    </Button>
                    <Button asChild variant="link" className="justify-start">
                        <Link to="https://youtube.com/c/Syuks">
                            <VideoIcon className="mr-2 h-4 w-4" />
                            YouTube
                        </Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav
