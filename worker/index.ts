/*export default {
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      return Response.json({
        name: "Cloudflare",
      });
    }
		return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
*/

import { Hono } from 'hono'
import { maps } from "./api/maps.ts"
import { steamProfiles } from "./api/steam/profiles.ts"
import { steamServersIp } from "./api/steam/servers/ip.ts"
import { steamServersMap } from "./api/steam/servers/map.ts"

const app = new Hono()

app.route("/api/maps", maps);
app.route("/api/steam/profiles", steamProfiles);
app.route("/api/steam/servers/ip", steamServersIp);
app.route("/api/steam/servers/map", steamServersMap);

export default app