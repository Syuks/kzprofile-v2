import CommandVirtual from "@/components/navbar/command-virtual"
import MainNav from "@/components/navbar/main-nav"
import MobileNav from "@/components/navbar/mobile-nav"
import ThemeToggle from "@/components/theme/theme-toggle"
import UserDropdown from "./user-dropdown"

function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center sm:px-8">
                <MainNav />
                <MobileNav />
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <CommandVirtual />
                    </div>
                    <ThemeToggle />
                    <UserDropdown />
                </div>
            </div>
        </header>
    )
}

export default Header
