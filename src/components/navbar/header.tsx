import { ExclamationTriangleIcon, Link2Icon } from "@radix-ui/react-icons"

import { useLocalSettings } from "@/components/localsettings/localsettings-provider"
import CommandVirtual from "@/components/navbar/command-virtual"
import MainNav from "@/components/navbar/main-nav"
import MobileNav from "@/components/navbar/mobile-nav"
import ThemeToggle from "@/components/theme/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import UserDropdown from "./user-dropdown"
function Header() {
  const [localSettings, setLocalSettings] = useLocalSettings()

  const useGokzTop = () => {
    setLocalSettings({ gokzTop: !localSettings.gokzTop })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center sm:px-8">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Tooltip delayDuration={0}>
            <TooltipTrigger onClick={useGokzTop}>
              <Badge
                variant={localSettings.gokzTop ? "default" : "destructive"}
                className="items-center space-x-1"
              >
                {localSettings.gokzTop ? <Link2Icon /> : <ExclamationTriangleIcon />}
                <span>{localSettings.gokzTop ? "gokz.top API" : "Global API"}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="text-center">
              <p>The Global API is currently missing support for some newer maps.</p>
              <p>
                If you experience issues, you can switch to the gokz.top API by clicking this badge.
              </p>
              <p>Courtesy of Cinyan10 gokz.top.</p>
            </TooltipContent>
          </Tooltip>
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
