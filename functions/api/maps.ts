interface Env {
    KZPROFILE: KVNamespace
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {
    const maps = await env.KZPROFILE.get("maps")
    return new Response(JSON.stringify(maps))
}
