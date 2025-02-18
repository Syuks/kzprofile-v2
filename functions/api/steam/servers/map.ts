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
        throw new Error("STEAM API KEY not set as environment variable.")
    }

    const url = "https://api.steampowered.com/IGameServersService/GetServerList/v1/"
    const params = new URL(request.url).searchParams

    const mapName = params.get("mapName")
    if (!mapName) {
        throw new Error("Please provide a map name in the query parameter 'mapName'")
    }

    const workshopId = params.get("workshopId")

    const queries = [`key=${env.STEAM_API_KEY}&format=json&filter=appid\\730\\map\\${mapName}`]

    if (workshopId) {
        queries.push(
            `key=${env.STEAM_API_KEY}&format=json&filter=appid\\730\\map\\/${workshopId}/${mapName}`,
        )
    }

    try {
        const responses = await Promise.all(queries.map((query) => fetch(`${url}?${query}`)))

        const servers: SteamServer[] = []

        for (const response of responses) {
            if (!response.ok) {
                console.error(`Error fetching data: ${response.statusText}`)
                continue // Skip failed requests instead of throwing an error
            }

            const data: { response?: { servers?: SteamServer[] } } = await response.json()

            // Ensure servers exist in the response before pushing
            if (data.response?.servers) {
                servers.push(...data.response.servers)
            }
        }

        return new Response(JSON.stringify(servers), {
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        console.error("Unexpected error:", error)
        return new Response("An error occurred while fetching server data.", { status: 500 })
    }
}
