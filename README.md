# Simple custom Shopify App developed with express
- `git checkout step-0`: initial state (nothing developed)
- `git checkout step-1`: able to run a Cloudflare tunnel and receive webhooks
- `git checkout step-2`: add HMAC check

## How to run
Navigate to your Shopify shop's Settings > Notifications > Webhooks and check
the sentence
> Your webhooks will be signed with [key]

Copy that value and paste it into the project's `.env` file (you'll have to
create one if missing; you can start by copying `.env.example`) as
`WEBHOOK_HMAC_SECRET`.

Run the commands:
- `npm run tunnel` and use the tunnel URL to register your hook in Shopify Admin
- `npm run dev` to run the express server with nodemon
