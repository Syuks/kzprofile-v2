const kzProfileAPI = {
    baseURL: "/api",
}

/**
 * Starts a GET HTTP Request to /api/maps
 *
 */
export const KZProfileAPI_GetMaps = () => {
    const url = "maps"

    return fetch(`${kzProfileAPI.baseURL}/${url}`)
}

/**
 * Starts a GET HTTP Request to /api/steam/profiles
 *
 */
export const SteamAPI_GetProfiles = (steamids: string[]) => {
    const url = "steam/profiles"
    const queryParams = {
        steamids: steamids.toString(),
    }
    const queryString = new URLSearchParams(queryParams).toString()

    return fetch(`${kzProfileAPI.baseURL}/${url}?${queryString}`)
}

/**
 * Starts a GET HTTP Request to /api/steam/vanity.
 * Use getVanityKey from SteamID to extract the key from the url
 *
 */
export const SteamAPI_VanityURL = (vanityKey: string) => {
    const url = "steam/vanity"
    const queryParams = {
        vanityKey: vanityKey,
    }
    const queryString = new URLSearchParams(queryParams).toString()

    return fetch(`${kzProfileAPI.baseURL}/${url}?${queryString}`)
}

/**
 * Starts a GET HTTP Request to /api/steam/servers/info
 *
 */
export const SteamAPI_ServersInfo = (servers: string[]) => {
    const url = "steam/servers/info"
    const queryParams = {
        servers: servers.toString(),
    }
    const queryString = new URLSearchParams(queryParams).toString()

    return fetch(`${kzProfileAPI.baseURL}/${url}?${queryString}`)
}

/**
 * Starts a GET HTTP Request to /api/steam/servers/ip
 *
 */
export const SteamAPI_ServersIp = (ip: string) => {
    const url = "steam/servers/ip"
    const queryParams = {
        ip: ip,
    }
    const queryString = new URLSearchParams(queryParams).toString()

    return fetch(`${kzProfileAPI.baseURL}/${url}?${queryString}`)
}

/**
 * Starts a GET HTTP Request to /api/steam/servers/map.
 * Use both map name and ID for a more complete answer.
 *
 */
export const SteamAPI_ServersMap = (mapName: string, workshopId: string) => {
    const url = "steam/servers/map"
    const queryParams = {
        mapName: mapName,
        workshopId: workshopId,
    }
    const queryString = new URLSearchParams(queryParams).toString()

    return fetch(`${kzProfileAPI.baseURL}/${url}?${queryString}`)
}
