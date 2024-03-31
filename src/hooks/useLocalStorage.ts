import { useState } from "react"

type SetValue<T> = (value: T | ((val: T) => T)) => void

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
    const getInitialValue = (): T => {
        const storedValue = localStorage.getItem(key)
        if (storedValue) {
            try {
                return JSON.parse(storedValue)
            } catch (error) {
                console.error(`Error parsing localStorage key '${key}': `, error)
            }
        }
        return initialValue
    }

    const [value, setValue] = useState<T>(getInitialValue)

    const updateValue: SetValue<T> = (newValue: T | ((val: T) => T)) => {
        const updatedValue =
            typeof newValue === "function" ? (newValue as (val: T) => T)(value) : newValue

        setValue(updatedValue)

        try {
            localStorage.setItem(key, JSON.stringify(updatedValue))
        } catch (error) {
            console.error(`Error setting localStorage key '${key}': `, error)
        }
    }

    return [value, updateValue]
}

export default useLocalStorage
