interface Env {
    KZPROFILE: KVNamespace
    CF_PAGES: string
    CF_PAGES_COMMIT_SHA: string
    CF_PAGES_BRANCH: string
    CF_PAGES_URL: string
}

export const onRequest: PagesFunction<Env> = async ({ env }) => {
    return new Response(
        JSON.stringify({
            CF_PAGES: env.CF_PAGES || "",
            CF_PAGES_COMMIT_SHA: env.CF_PAGES_COMMIT_SHA || "",
            CF_PAGES_BRANCH: env.CF_PAGES_BRANCH || "",
            CF_PAGES_URL: env.CF_PAGES_URL || "",
        }),
    )
    /*const maps = await env.KZPROFILE.get("maps")
    return new Response(JSON.stringify(maps))*/
}
