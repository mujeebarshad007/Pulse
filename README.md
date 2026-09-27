# PULSE

A healthcare web application being built one complete journey at a time. **Current artifact: interactive frontend design samples with fictional data.** The complete frontend, authentication, database and backend business features are not finished.

## Start here

- [Where we are, every changed file, and how to learn it](docs/frontend-design-review.md)
- [Future prompts](docs/prompt-pack.md) — start with UI-01/UI-02, not the older NestJS scaffolding prompt.
- [Frozen product scope](docs/requirements/MVP-freeze.md)

## Run the samples

```bash
cd web
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Compare **Air**, **Nocturne**, and **Studio** at the top of the page. Try section navigation, fictional doctor filtering, detail dialogs and Reduce glass. Open [the design system](http://localhost:3000/design-system) for reusable controls. State resets on reload; no data is saved.

## Verify

From `web/`:

```bash
npm run lint
npm run build
npm run start -- --port 3001
```

The last command serves the built artifact at [localhost:3001](http://localhost:3001). Stop it with Ctrl+C. Browser validation evidence is recorded in the design checkpoint document. There is no automated application test suite yet.

## Honest implementation boundary

The fictional sample filter is not the real required symptom/specialization/location search. No real booking, login, upload, private report access or disease publishing exists. The [architecture](docs/architecture/system-architecture.md) plans Next.js server code, PostgreSQL and private storage; those later boundaries are not deployed resources. No credentials or private records are needed to run the preview.
