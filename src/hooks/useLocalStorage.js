// https://usehooks.com/useLocalStorage/

import { useState } from "react"

export const useLocalStorage = (key, initialValue) => {
    
    const [storedValue, setStoredValue] = useState(() => {
        const item = window.localStorage.getItem(key)
        return item ? JSON.parse(item) : initialValue
    })

    // Wrapper to persist localStorage on setState
    const setValue = (newValue) => {
        // Allow value to be a function so we have same API as useState
        const valueToStore = newValue instanceof Function ? newValue(storedValue) : newValue
        
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
    }
    
    return [storedValue, setValue]
}