import {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    PropsWithChildren,
    useEffect,
} from "react"

import { useSearchParams } from "react-router-dom"

import { GameModeLabel, gameModeLabelSchema, RunType, runTypeSchema } from "@/lib/gokz"

import useLocalStorage from "@/hooks/useLocalStorage"

export type Theme = "dark" | "light" | "system"

type LocalSettings = {
    theme: Theme
    modeChooserType: "pro-tp" | "pro-nub"
    mode: GameModeLabel
    type: RunType
    defaultSortOrderYours: "points" | "created_at"
    defaultSortOrderOthers: "points" | "created_at"
    defaultProfilePage: boolean
    dateFormat: "yyyy-MM-dd" | "MM-dd-yyyy" | "dd-MM-yyyy"
    tablePageSize: number
}

type LocalSettingsContextType = [LocalSettings, Dispatch<SetStateAction<LocalSettings>>]

const defaultLocalSettings: LocalSettings = {
    theme: "dark",
    modeChooserType: "pro-tp",
    mode: "kz_timer",
    type: "pro",
    defaultSortOrderYours: "points",
    defaultSortOrderOthers: "points",
    defaultProfilePage: false,
    dateFormat: "yyyy-MM-dd",
    tablePageSize: 20,
}

const LocalSettingsContext = createContext<LocalSettingsContextType | undefined>(undefined)

export const LocalSettingsProvider = ({ children }: PropsWithChildren) => {
    const [localSettings, setLocalSettings] = useLocalStorage<LocalSettings>(
        "localSettings-v1",
        defaultLocalSettings,
    )

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")

        if (localSettings.theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"

            root.classList.add(systemTheme)
            root.style.colorScheme = systemTheme
            return
        }

        root.classList.add(localSettings.theme)
        root.style.colorScheme = localSettings.theme
    }, [localSettings.theme])

    return (
        <LocalSettingsContext.Provider value={[localSettings, setLocalSettings]}>
            {children}
        </LocalSettingsContext.Provider>
    )
}

// Context Hooks

export const useLocalSettings = (): [LocalSettings, (val: Partial<LocalSettings>) => void] => {
    const context = useContext(LocalSettingsContext)

    if (context === undefined) {
        throw new Error("useLocalSettings must be used within a LocalSettingsProvider")
    }
    const [localSettings, setLocalSettings] = context

    const updateLocalSettings = (newLocalSettings: Partial<LocalSettings>) => {
        setLocalSettings((oldLocalSettings) => {
            return {
                ...oldLocalSettings,
                ...newLocalSettings,
            }
        })
    }

    return [localSettings, updateLocalSettings]
}

export const useGameMode = (): [GameModeLabel, (val: GameModeLabel) => void] => {
    const [localSettings, setLocalSettings] = useLocalSettings()
    const [searchParams] = useSearchParams()

    // Override localSettings.mode with searchParams "mode"
    useEffect(() => {
        const value =
            searchParams.get("mode") ||
            searchParams.get("game_mode") ||
            searchParams.get("gameMode") ||
            searchParams.get("game")

        const result = gameModeLabelSchema.safeParse(value)
        if (result.success) {
            setLocalSettings({ mode: value } as { mode: GameModeLabel })
        }
    }, [searchParams])

    const updateGameMode = (newMode: GameModeLabel) => {
        setLocalSettings({ mode: newMode })
    }

    return [localSettings.mode, updateGameMode]
}

export const useRunType = (): [RunType, (val: RunType) => void] => {
    const [localSettings, setLocalSettings] = useLocalSettings()
    const [searchParams] = useSearchParams()

    // Override localSettings.type with searchParams "type"
    useEffect(() => {
        const value =
            searchParams.get("type") ||
            searchParams.get("run_type") ||
            searchParams.get("runType") ||
            searchParams.get("run")

        const result = runTypeSchema.safeParse(value)
        if (result.success) {
            setLocalSettings({ type: value } as { type: RunType })
        }
    }, [searchParams])

    const updateRunType = (newType: RunType) => {
        setLocalSettings({ type: newType })
    }

    return [localSettings.type, updateRunType]
}
