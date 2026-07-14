# Render setup

## What this deploys
- `bestbuy-bot-api` web service
- `bestbuy-bot-worker` background worker
- `bestbuy-bot-db` Postgres database

## How to deploy
1. Put these files into a GitHub repo.
2. In Render, click New > Blueprint.
3. Connect the repo.
4. Render reads `render.yaml` and creates the API, worker, and Postgres database.
5. Fill in the secret env vars:
   - `OPENAI_API_KEY`
   - `RINGCENTRAL_CLIENT_ID`
   - `RINGCENTRAL_CLIENT_SECRET`
   - `RINGCENTRAL_JWT`
   - `WEBHOOK_VALIDATION_TOKEN`
6. Deploy.

## After deploy
- Open the API URL and visit `/health`.
- Run `schema.sql` against the Render Postgres database.
- Set the RingCentral webhook to `https://YOUR-API.onrender.com/webhooks/ringcentral`.
- RingCentral webhook validation can use the `Validation-Token` header, which should be echoed back on subscription verification.

## Networking
The worker and API can talk internally inside the same Render workspace over the private network.
