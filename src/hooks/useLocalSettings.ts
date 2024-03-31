import useLocalStorage from "./useLocalStorage"

type LocalSettings = {
    modeChooserType: string
    defaultSortOrderYours: string
    defaultSortOrderOthers: string
    defaultProfilePage: string
    dateFormat: string
}

const defaultLocalSettings: LocalSettings = {
    modeChooserType: "pro-tp",
    defaultSortOrderYours: "points",
    defaultSortOrderOthers: "points",
    defaultProfilePage: "",
    dateFormat: "yyyy-MM-dd",
}

function useLocalSettings(): [
    LocalSettings,
    (value: LocalSettings | ((val: LocalSettings) => LocalSettings)) => void,
] {
    const [localSettings, setLocalSettings] = useLocalStorage<LocalSettings>(
        "localSettings",
        defaultLocalSettings,
    )

    return [localSettings, setLocalSettings]
}

export default useLocalSettings
