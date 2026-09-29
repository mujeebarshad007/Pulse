# Pulse web

This is the Next.js app. Read the [main README](../README.md), [connected file guide](../docs/connected-app-guide.md) and [setup guide](../docs/deploy-tester.md).

```bash
npm ci
npm run db:local:start
npm run db:migrate
npm run db:seed
npm run dev
npm run check:all
```

Configure the local database URL in ignored `.env.local` first. Google entry needs the settings in `.env.example`; never commit real values. Connected screens use authenticated APIs. `APP_MODE=demo` explicitly selects the original memory-only prototype.

`npm run build` creates a standalone bundle. See `Dockerfile` for a durable-volume host. A local production preview can use `npm run start -- --port 3001`; the OAuth base/callback URL must match the actual sign-in origin.
