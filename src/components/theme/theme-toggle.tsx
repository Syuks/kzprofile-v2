import { SunIcon, MoonIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useLocalSettings, Theme } from "@/components/localsettings/localsettings-provider"

function ThemeToggle() {
    const [_localSettings, setLocalSettings] = useLocalSettings()

    const changeTheme = (newTheme: Theme) => {
        setLocalSettings({ theme: newTheme })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ThemeToggle
