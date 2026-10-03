# Pulse: Google sign-in and a shareable tester link

This guide is for the fictional-data tester release. Code is prepared; no Google project, host account or live deployment has been created. Never paste secrets into chat or commit them to Git.

## 1. See the app locally

From the repository root:

```bash
npm run db:local:start
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. New machines first run `npm run setup` and put the local database URL printed by the first command in ignored `web/.env.local`. The directory/library work now; account features need the next step. Keep the terminal running.

## 2. Configure Google once

Run `npm run auth:check` before testing. A placeholder client secret was found during the latest investigation; see [login recovery](login-recovery.md) if Google returns to login. Passing this check validates syntax, not Google's acceptance of the credentials.

1. Open [Google Cloud Console](https://console.cloud.google.com/) in your own account and create/select a project for Pulse.
2. Configure Google Auth Platform branding/audience. Use the app name Pulse, your real owner/support contact, and testing mode with your intended tester Google accounts where required.
3. Create an OAuth client of type **Web application**. Add the exact local callback: `http://localhost:3000/api/auth/callback/google`.
4. Save the client ID and client secret privately in ignored `web/.env.local`, using the names below. Generate an independent random `BETTER_AUTH_SECRET` using your password manager or a local secret generator, at least 32 characters. Do not use the placeholder text.

```dotenv
APP_MODE=connected
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=<your-private-random-secret>
GOOGLE_CLIENT_ID=<your-web-client-id>
GOOGLE_CLIENT_SECRET=<your-web-client-secret>
```

Keep the existing `DATABASE_URL` entry. Restart `npm run dev`, open `/login`, select **Continue with Google**, and finish Google consent yourself. The first successful login creates a patient account. Complete the test profile with a fictional display name/city. Your Google email is the account identifier and cannot be changed in the profile form.

This integration requests basic identity, not Gmail, Drive or Calendar access. Callback URLs must match exactly. See [Better Auth Google configuration](https://better-auth.com/docs/authentication/google) and [Google's web-server OAuth guide](https://developers.google.com/identity/protocols/oauth2/web-server). Google-specific restrictions and console wording can change; follow the current console prompts without sharing credentials.

## 3. Give testers staff workspaces

Each tester signs in once and opens their workspace. Then the owner runs these commands from the repository root, replacing the example addresses with those testers' Google emails:

```bash
npm run staff -- doctor-tester@example.com doctor doctor-maya
npm run staff -- lab-tester@example.com lab
npm run staff -- editor-tester@example.com editor
```

`doctor-maya` is the retained internal seed ID for the fictional **Dr. Ayesha Khan** profile. Other seed IDs: `doctor-adam` (Hamza Ali), `doctor-sara` (Sana Ahmed), `doctor-owen` (Usman Shah), `doctor-leila` (Maryam Noor). Internal IDs do not claim real people or registration.

The command revokes old sessions. Staff sign in again to see their new role. It does not send invitations. A doctor grant without the final seed ID permits creating their own fictional profile through the existing form. Do not reassign roles casually once test records exist; there is no general account-transfer/deletion workflow.

## 4. First complete test

1. A patient signs in, completes their profile, finds the assigned fictional doctor and requests a future slot.
2. The doctor signs in separately and confirms it. The patient sees the change after Refresh or within 15 seconds while the tab is visible.
3. The patient copies their **Patient reference** from My profile and shares it with the lab tester.
4. The lab prepares a trusted, fictional PDF under 10 MB, enters that reference, reviews the returned patient name and uploads.
5. The patient downloads the PDF. A second patient must not see it, and a direct request for its download URL must fail for that account.
6. The editor saves a draft, checks that it is absent from the public library, then publishes it. Refresh to verify persistence.

Also check keyboard navigation, modal Escape/focus return and a narrow phone viewport. Browser automation was blocked in this environment; these UI checks and the actual Google round trip still require verification.

## 5. Hosting recommendation

For this implementation, use a **Node web service with PostgreSQL and a persistent disk**. Render is one option that supports this combination. Its disks require a paid service, retain only files beneath the mount path and allow one service instance. Review its current prices before purchasing; no paid service has been provisioned. [Render Next.js](https://render.com/docs/deploy-nextjs-app), [persistent disks](https://render.com/docs/disks), [PostgreSQL](https://render.com/docs/postgresql-creating-connecting).

A free ephemeral filesystem would lose report files on redeploy. Vercel-style serverless hosting needs a separate private object-storage adapter first. That adapter is not implemented in this delivery.

For a Node web service:

| Setting | Value |
|---|---|
| Repository root directory | `web` |
| Node | 22 |
| Build | `npm ci && npm run build && npm run backend:compile` |
| Pre-deploy database migration | `node --conditions=react-server scripts/database.mjs migrate` |
| Start | `npm run start -- --hostname 0.0.0.0 --port $PORT` |
| Health path | `/api/health` |
| Persistent disk mount | `/var/data` |
| `PRIVATE_STORAGE_DIR` | `/var/data/pulse/reports` |
| Instances | One while using private disk storage |

Create a separate managed PostgreSQL database. The migration account needs permission for the standard `btree_gist` extension. Set `DATABASE_URL` privately using a provider connection that supports verified TLS, with `sslmode=verify-full`. If a provider's internal endpoint does not support verified TLS, use its documented TLS endpoint and certificate configuration; do not disable verification. `DATABASE_POOL_MAX=10` is the default, not a capacity guarantee.

Set Google variables and `BETTER_AUTH_SECRET` through host secret settings. Set `BETTER_AUTH_URL` to the exact HTTPS service origin. Add `https://YOUR-HOST/api/auth/callback/google` to Google's allowed callbacks. Do not copy the local Unix-socket URL to a remote host.

After migration, run the seed command in the service shell:

```bash
node --conditions=react-server scripts/manage-app.mjs seed
```

Staff assignment there uses `node --conditions=react-server scripts/manage-app.mjs staff EMAIL ROLE [DOCTOR_ID]`. Restrict service-shell and database access to the owner/operators.

The host/repository connection, billing and actual deployment must be completed in your accounts. This repository has not been pushed or published by this work.

## 6. Alternative Docker package

`web/Dockerfile` builds a non-root standalone Node image. From the repository root:

```bash
docker build -t pulse-tester ./web
```

Configure the same environment variables privately and mount a writable persistent volume at `/var/lib/pulse/reports` owned by the container's `node` user. Run the migration command as a controlled release step before starting `node server.js`. The image includes compiled CLI scripts and SQL migrations. Do not build environment files or private storage into the image; `.dockerignore` and tracing exclusions protect these inputs.

Docker was not available locally, so the image build itself is unverified. The application build and database tests are verified separately.

## 7. Before sending the link

Run `npm run check:all`. Verify the hosted HTTPS page, `/api/health`, Google round trip, all four roles, refresh persistence, PDF access from another account, and persistence after a restart. Check that database and private files are backed up together and that a restore is possible before retaining anything important. Automated operational backup/restore and malware inspection are not implemented.

Send the resulting HTTPS service URL with: “Pulse tester build — fictional providers and trusted fictional documents only.” No live link exists until hosting is configured. If a deployment fails, keep the prior image/revision and data, restore the prior application version only when compatible with the forward-only schema, and inspect sanitized logs. Never delete the database or report volume as a routine rollback.
