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

export function getFileSizeString(bytes: number): string {
    if (bytes < 0) {
        throw new Error("Bytes cannot be negative")
    }

    const units = ["Bytes", "KB", "MB", "GB", "TB"]
    const index = Math.floor(Math.log(bytes) / Math.log(1024)) || 0

    const size = bytes / Math.pow(1024, index)

    return `${size.toFixed(2)} ${units[index]}`
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

export interface TimeUntilMidnightString {
    hours: string
    minutes: string
    seconds: string
}

export function timeUntilMidnightString(): TimeUntilMidnightString {
    const now = new Date()
    const midnight = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0),
    )

    const seconds = Math.floor((midnight.getTime() - now.getTime()) / 1000)

    return {
        hours: Math.floor(seconds / 3600)
            .toString()
            .padStart(2, "0"),
        minutes: Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, "0"),
        seconds: Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0"),
    }
}

export const todayUTC = (): string => {
    const now = new Date()
    return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`
}
