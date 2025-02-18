//Endpoint: https://api.steampowered.com/IGameServersService/GetServerList/v1/?key={key}&format=json&filter=appid\730\map\{map}
//Filters: https://developer.valvesoftware.com/wiki/Master_Server_Query_Protocol#Filter

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

    const ip = new URL(request.url).searchParams.get("ip")

    if (!ip) {
        throw new Error("Please provide a server IP address in the query parameter 'ip'")
    }

    const url = "https://api.steampowered.com/IGameServersService/GetServerList/v1/"
    const queryParams = {
        key: env.STEAM_API_KEY,
        format: "json",
        filter: `appid\\730\\addr\\${ip}`,
    }
    const queryString = new URLSearchParams(queryParams).toString()

    const response = await fetch(`${url}?${queryString}`)

    if (!response.ok) {
        throw new Error("Network response was not ok.")
    }

    const data: { response: { servers: SteamServer[] } } = await response.json()

    return new Response(JSON.stringify(data.response.servers))
}
