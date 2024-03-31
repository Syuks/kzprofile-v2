//https://developer.valvesoftware.com/wiki/SteamID
//http://whatsmysteamid.azurewebsites.net/

//Steam64 = 76561198267993933
//Binary  = 00000001 0001 00000000000000000001 0001001001010111100011110100110 1
//          ^      ^ ^  ^ ^                  ^ ^                             ^ ^
//          |______| |__| |__________________| |_____________________________| |
//              U     AT        INSTANCE              32-BIT ACCOUNT ID        Y
//Steam32  = STEAM_1:1:153864102 -> STEAM_U:Y:32-bit
//Y is actually part of the 32 bits, it is just displayed separetly

import { regEx_SteamID32, regEx_SteamID64, regEx_SteamProfile } from "./regex-library"

export const getSteam32 = (input: string) => {
    if (regEx_SteamID32.test(input)) {
        return input
    }

    if (regEx_SteamID64.test(input)) {
        let steamId64 = BigInt(input)

        const universe = (steamId64 >> 56n) & 0xffn

        const accountIdLowBit = steamId64 & 1n

        const accountIdHighBits = (steamId64 >> 1n) & 0x7fffffffn

        return "STEAM_" + universe + ":" + accountIdLowBit + ":" + accountIdHighBits
    }

    if (regEx_SteamProfile.test(input)) {
        const result = regEx_SteamProfile.exec(input)

        if (result?.length) {
            return result[1]
        }
    }

    //if (regEx_SteamVanityProfile.test(input)) {}

    return null
}

export const getSteam64 = (input: string) => {
    if (regEx_SteamID64.test(input)) {
        return input
    }

    if (regEx_SteamID32.test(input)) {
        //will just assume universe, account type and instance as 1

        const firstHalf = "00000001000100000000000000000001"

        const steamId32Array = input.split(":")

        const accountIdLowBit = steamId32Array[1]

        const accountIdHighBits = parseInt(steamId32Array[2]).toString(2) //toString(2) from int to bits

        const secondHalf = accountIdHighBits.padStart(31, "0") + accountIdLowBit //padStart makes sure we get the whole 31 bits with leading zeros

        const steamId64 = BigInt("0b" + (firstHalf + secondHalf)) //parsing the string back to a number

        return steamId64.toString()
    }

    if (regEx_SteamProfile.test(input)) {
        const result = regEx_SteamProfile.exec(input)

        if (result?.length) {
            return result[1]
        }
    }

    //if (regEx_SteamVanityProfile.test(input)) {}

    return null
}
