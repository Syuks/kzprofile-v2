import { Hono } from "hono"

import { maps } from "./api/maps.ts"
import { steamProfiles } from "./api/steam/profiles.ts"
import { steamServersIp } from "./api/steam/servers/ip.ts"
import { steamServersMap } from "./api/steam/servers/map.ts"
import { syncMaps } from "./sync-maps.ts"

const app = new Hono<{ Bindings: Env }>()

app.route("/api/maps", maps)
app.route("/api/steam/profiles", steamProfiles)
app.route("/api/steam/servers/ip", steamServersIp)
app.route("/api/steam/servers/map", steamServersMap)

export default {
  fetch: app.fetch,
  scheduled: async (_event, env, ctx) => {
    ctx.waitUntil(syncMaps(env))
  },
} satisfies ExportedHandler<Env>
