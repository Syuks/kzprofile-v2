import { Hono } from "hono";
//import kzProfileMaps from "../../data/maps.json"

export const maps = new Hono<{Bindings: Env}>()

maps.get("/", async (c) => {
  // In Cloudflare Pages, local development uses local storage.
  // It cannot access data stored on Cloudflare’s servers.
  // KV must be seeded:

  //await env.KZPROFILE.put("maps-v2", JSON.stringify(kzProfileMaps))

  // Cache the "maps-v2" KV until midnight UTC.
  let d = new Date()
  const cacheMaxAge = Math.floor(-(d.getTime() - d.setHours(24, 0, 0, 0)) / 1000)

  const maps = await c.env.KZPROFILE.get("maps-v2")

  if (!maps) {
    return c.json([], 200, {
      "Cache-Control": `max-age=${cacheMaxAge}`,
    })
  }

  return c.json(JSON.parse(maps), 200, {
    "Cache-Control": `max-age=${cacheMaxAge}`,
  })
});
