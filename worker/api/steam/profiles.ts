import { Hono } from "hono";

interface PlayerSummary {
    steamid: string
    personaname: string
    profileurl: string
    avatar: string
    avatarmedium: string
    avatarfull: string
    personastate: number
    realname: string
    primaryclanid: string
    timecreated: number
    personastateflags: number
    loccountrycode: string
    locstatecode: string
}

export const steamProfiles = new Hono<{Bindings: Env}>()

steamProfiles.get("/", async (c) => {
  if (!c.env.STEAM_API_KEY) {
        throw new Error("STEAM API KEY not set as evironment variable.")
    }

    const steamids = c.req.query("steamids")?.split(",").filter(Boolean) ?? []

    if (steamids.length === 0) {
        throw new Error("Please provide Steam IDs in the query parameter 'steamids'")
    }

    const url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
    const queryParams = {
        steamids: steamids.toString(),
        key: c.env.STEAM_API_KEY,
    }
    const queryString = new URLSearchParams(queryParams).toString()

    const response = await fetch(`${url}?${queryString}`)

    if (!response.ok) {
        throw new Error("Network response was not ok.")
    }

    const data: { response: { players: PlayerSummary[] } } = await response.json()

    return c.json(data.response.players)
});
