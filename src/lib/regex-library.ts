/**
 * @returns No capture groups.
 * @example "STEAM_1:1:153864102"
 */
export const regEx_SteamID32 = /^STEAM_[0-5]:[01]:\d+$/

/**
 * @returns No capture groups.
 * @example "76561198267993933"
 */
export const regEx_SteamID64 = /^[0-9]{17}$/

/**
 * @returns SteamID 64.
 * @example "https://steamcommunity.com/profiles/76561198267993933/"
 */
export const regEx_SteamProfile = /^https:\/\/steamcommunity\.com\/profiles\/([0-9]{17})(?:\/)?$/

/**
 * @returns Vanity Key.
 * @example "https://steamcommunity.com/id/Syuks/"
 */
export const regEx_SteamVanityProfile = /^https:\/\/steamcommunity\.com\/id\/(\S+?)\/?$/

/**
 * @returns IP and optional Port.
 * @example "131.196.2.210:27019"
 */
export const regEx_ServerIP = /^((?:[0-9]{1,3}\.){3}[0-9]{1,3})(?::([0-9]{1,5}))?$/

//export const regEx_KZMap = /(?:bkz_|kzpro_|kz_|skz_|vnl_|xc_)\S+$/i