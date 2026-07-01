# KZ Profile v2

## Environment variables

Create a `.dev.vars` file in the root of the respository and add your STEAM API KEY like this: `STEAM_API_KEY=<YOUR KEY>`

Then set your `STEAM_API_KEY` environment variable in your Cloudflare dashboard for production and preview.

## KV

Create a KV namespace in your Cloudflare dashboard and bind it to your Cloudflre Page with the binding name `KZPROFILE`.

Change the ID of the binding inside `wrangler.jsonc`.

## Run

To start the development server run `vp run dev`.
