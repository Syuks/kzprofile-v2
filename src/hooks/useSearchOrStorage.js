import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useLocalStorage } from "./useLocalStorage"

export const useSearchOrStorage = (key, initialValue) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [storageItem, setStorageItem] = useLocalStorage(key, initialValue)

    const [searchOrStorageValue, setSearchOrStorageValue] = useState(() => {
        const param = searchParams.get(key)

        if (param)
            return param
        
        return storageItem
    })

    // Wrapper to persist localStorage and clear searchParams on setState
    const setValue = (newValue) => {
        // Allow value to be a function so we have same API as useState
        const valueToStore = newValue instanceof Function ? newValue(searchOrStorageValue) : newValue

        setSearchOrStorageValue(valueToStore)
        setStorageItem(valueToStore)
        setSearchParams({})
        //setSearchParams({key: valueToStore})
    }

    return [searchOrStorageValue, setValue]
}