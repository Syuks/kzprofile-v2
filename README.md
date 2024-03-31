# KZ Profile v2

## Environment variables

Create a `.dev.vars` file in the root of the respository and add your STEAM API KEY like this: `STEAM_API_KEY=<YOUR KEY>`

Then set your `STEAM_API_KEY` environment variable in your Cloudflare dashboard for production and preview.

## KV

Create a KV namespace in your Cloudflare dashboard and bind it to your Cloudflre Page with the binding name `KZPROFILE`.

Create a `wrangler.toml` file in the root of the respository and add your KV binding like this:

```js
kv_namespaces = [
  { binding = "KZPROFILE", id = "<YOUR KV NAMESPACE ID>", preview_id = "<YOUR KV NAMESPACE ID>" },
]
```

In Cloudflare Pages, local development uses local storage. It cannot access data stored on Cloudflare’s servers.
KV must be seeded separetly for local development. See `functions/api/maps.ts`

## Run

To start the development server run `npx wrangler pages dev -- npm run dev`
