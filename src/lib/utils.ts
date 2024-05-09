import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FormatDistanceToNowStrictOptions, formatDistanceToNowStrict } from "date-fns"

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

export function getFileSizeString(fileSize: number): string {
    return `${(fileSize / Math.pow(1024, 2)).toFixed(0)} MB`
}

export function formatDistanceToNowStrictWithOffset<DateType extends Date>(
    date: string | number | DateType,
    options?: FormatDistanceToNowStrictOptions,
): string {
    return formatDistanceToNowStrict(
        new Date(date).getTime() - new Date().getTimezoneOffset() * 60 * 1000,
        options,
    )
}

export function getWorkshopLink(workshopId: string) {
    return `https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopId}`
}

export function generateRandomString(minLength: number, maxLength: number) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?"
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
    let result = ""
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}
