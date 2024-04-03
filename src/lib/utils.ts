import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getTimeString(time: number): string {
    const dateString = new Date(time * 1000).toISOString()

    if (time / 86400 < 1) {
        return dateString.substring(11, 23)
    }

    const hours = Math.floor(time / (60 * 60)).toString()
    return `${hours.padStart(2)}${dateString.substring(13, 23)}`
}
