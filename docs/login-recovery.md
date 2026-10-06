# Google login recovery

## Findings — 2026-10-03

`GOOGLE_CLIENT_SECRET` contains placeholder text. The old readiness check accepted some placeholder formats and incorrectly enabled the Google button. The local authentication database had no completed users or sessions. This supports an incomplete setup diagnosis; it does not prove a cookie defect after a successful Google login.

There were also two local servers: the production preview on port 3000 and development on 3001. `BETTER_AUTH_URL` is configured for `http://localhost:3000`. Use the same origin throughout login; changing hostname/port must not bypass origin protection.

## Complete setup privately

1. Open the Pulse OAuth **Web application** client in [Google Cloud Console](https://console.cloud.google.com/).
2. Put its real client secret in the existing `GOOGLE_CLIENT_SECRET` entry in ignored `web/.env.local`. Verify that `GOOGLE_CLIENT_ID` belongs to the same client. If the secret is no longer visible, manage it yourself using Google's supported flow. Never paste it into chat or commit it.
3. Keep `BETTER_AUTH_URL=http://localhost:3000`. Register this exact redirect URI in Google: `http://localhost:3000/api/auth/callback/google`. Preserve the existing independent `BETTER_AUTH_SECRET` and database connection.
4. Run `npm run auth:check`. Passing verifies configuration syntax, not that Google accepts the credentials.
5. Restart the server on port 3000 to load the changed environment. Use one chosen server: stop the old production preview before starting `npm run dev`, or run `npm run build` and then `npm run start` after stopping the old preview. Do not silently move login testing to port 3001.
6. Open `/login`, finish Google consent yourself, and verify the patient workspace opens. Reload to check persistence; sign out to check protected data disappears. Include intended testers in Google's testing audience when required.

For deployment, use the exact Netlify HTTPS origin in both configuration and Google's registered callback. See [Netlify instructions](netlify-deployment.md).

## Code changes

| Files | Responsibility |
| --- | --- |
| `server/configuration.ts` | Reject placeholder credentials, invalid origins and short session secrets |
| `server/auth.ts` | Route OAuth failures to login; log only a diagnostic category/level, never raw provider arguments |
| `features/pulse/auth-feedback.ts`, login route, `google-entry.tsx` | Show safe, actionable cancellation/state/configuration/session errors without echoing arbitrary provider text |
| `features/pulse/provider.tsx`, account route | Distinguish failed workspace loading from an anonymous session; offer Retry rather than silently returning to login |
| `server/assistant.ts` | Apply the same placeholder check to AI credentials/model |
| `scripts/auth-check.mjs`, `release-check.mjs` | Diagnose configuration using variable names only; require a valid HTTPS origin for release |
| `tests/auth-feedback.test.ts`, `tests/backend/auth-configuration.test.ts` | Exercise error sanitization, configuration rejection, local production cookie attributes and OAuth error routing |

No credentials were created or changed. Cookie, origin and server role checks remain enforced. Tests use fictional credentials and isolated PostgreSQL; they do not sign in to Google.

```bash
npm run auth:check
npm run check:all
npm run release:check
git diff --check
npm run package:netlify
```

The first command should fail until the real Google secret is entered. Release validation additionally needs AI and hosted settings. Learning exercise: trace **configuration present → Google accepts authorization → browser session cookie → workspace data**. Explain why a Google button proves only the first check, and why a failed data request does not prove logout.

Reference: [Better Auth OAuth errors](https://better-auth.com/docs/reference/errors), [error handling options](https://better-auth.com/docs/reference/options).


## Rechecked 2026-10-07

`npm run auth:check` passed syntax validation. Real OAuth credentials were configured in ignored `web/.env.local`. Google requires the registered callback to match exactly; see [official Google web-server OAuth setup](https://developers.google.com/identity/protocols/oauth2/web-server). For localhost use `http://localhost:3000/api/auth/callback/google`; for Netlify register the actual HTTPS site origin plus `/api/auth/callback/google`. The client ID and secret must come from that same OAuth web client. No secret values are stored in documentation or Git.

