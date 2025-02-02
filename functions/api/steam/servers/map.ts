interface Env {
    STEAM_API_KEY: string
}

interface SteamServer {
    addr: string
    appid: number
    bots: number
    dedicated: boolean
    gamedir: string
    gameport: number
    gametype: string
    map: string
    max_players: number
    name: string
    os: string
    players: number
    product: string
    region: number
    secure: boolean
    steamid: string
    version: string
}

export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
    if (!env.STEAM_API_KEY) {
        throw new Error("STEAM API KEY not set as evironment variable.")
    }

    const mapName = new URL(request.url).searchParams.get("mapName")

    if (!mapName) {
        throw new Error("Please provide a map name in the query parameter 'mapName'")
    }

    const url = "https://api.steampowered.com/IGameServersService/GetServerList/v1/"

    const mapNameQueryParams = {
        key: env.STEAM_API_KEY,
        format: "json",
        filter: `appid\\730\\map\\${mapName}`,
    }
    const mapNameQueryString = new URLSearchParams(mapNameQueryParams).toString()

    const promises = [fetch(`${url}?${mapNameQueryString}`)]

    // In some servers the maps are named "/{id}/{name}" for example "/1464119184/kz_continuum"
    // Some other servers use this format "workshop/{id}/{name}" but for some reason, the master server also returns these servers with only "/{id}/{name}"
    const workshopId = new URL(request.url).searchParams.get("workshopId")

    if (workshopId) {
        const workshopIdQueryParams = {
            key: env.STEAM_API_KEY,
            format: "json",
            filter: `appid\\730\\map\\/${workshopId}/${mapName}`,
        }

        promises.push(fetch(`${url}?${workshopIdQueryParams}`))
    }

    const responses = await Promise.all(promises)

    const servers: SteamServer[] = []

    for (const response of responses) {
        if (!response.ok) {
            throw new Error("Network response was not ok.")
        }

        const data: { response: { servers: SteamServer[] } } = await response.json()
        servers.push(...data.response.servers)
    }

    return new Response(JSON.stringify(servers))
}
