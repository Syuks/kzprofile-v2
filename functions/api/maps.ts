interface Env {
    KZPROFILE: KVNamespace
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {
    // In Cloudflare Pages, local development uses local storage.
    // It cannot access data stored on Cloudflare’s servers.
    // KV must be seeded:

    // await env.KZPROFILE.put("maps", JSON.stringify(kzProfileMaps))

    // Cache the "maps" KV until midnight UTC.
    let d = new Date()
    const cacheMaxAge = -(d.getTime() - d.setHours(24, 0, 0, 0)) / 1000

    const maps = await env.KZPROFILE.get("maps")
    return new Response(JSON.stringify(maps), {
        headers: {
            "content-type": "application/json;charset=UTF-8",
            "Cache-Control": `max-age=${cacheMaxAge}`,
        },
    })
}
