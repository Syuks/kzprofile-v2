import { useState } from "react"

export const useLocalSettings = () => {
    const defaultValue = {
        modeChooserType: "pro-tp",
        defaultSortOrderYours: "points",
        defaultSortOrderOthers: "points",
        defaultProfilePage: "",
        dateFormat: "yyyy-MM-dd"
    }

    const [localSettings, setLocalSettings] = useState(() => {
        const item = window.localStorage.getItem("localSettings")
        return item ? JSON.parse(item) : defaultValue
    })

    // Wrapper to persist localStorage on setState
    const setValue = (newValue) => {
        // Allow value to be a function so we have same API as useState
        const valueToStore = newValue instanceof Function ? newValue(localSettings) : newValue
        
        setLocalSettings(valueToStore)
        window.localStorage.setItem("localSettings", JSON.stringify(valueToStore))
    }

    return [localSettings, setValue]
}