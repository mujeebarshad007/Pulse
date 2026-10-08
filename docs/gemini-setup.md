# Gemini setup and the assistant's data flow

2026-10-08. Pulse supports Google Gemini and the existing OpenAI provider. No Google SDK or other dependency was added. Provider calls run on the server, never in the browser.

## Enter your key privately

In ignored `web/.env.local`, set these values yourself:

```dotenv
AI_PROVIDER=gemini
GEMINI_API_KEY=YOUR_PRIVATE_KEY_GOES_HERE
GEMINI_MODEL=gemini-3.5-flash-lite
AI_DAILY_REQUEST_LIMIT=100
```

The line above is an instruction placeholder, not a working credential. The app rejects placeholder keys. Do not paste a real key into chat, commit it, put it in a `NEXT_PUBLIC_` variable, or place it in the deployment source folder. The current local provider/model have been selected for Gemini; the key still needs your private entry. Restart the app after editing the environment.

For Netlify, add these as private server environment variables and rebuild. The source package intentionally excludes `.env.local`. Google sign-in still uses the separate `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; a Gemini key does not replace them.

`gemini-3.5-flash-lite` is listed with a free tier in [Google's pricing](https://ai.google.dev/gemini-api/docs/pricing), checked 2026-10-08. Confirm availability and your project's quota in AI Studio. Free quota is limited and can change; the app cannot guarantee free usage. It does not enable Google Search grounding or automatically switch to another paid provider. Daily app limits count requests, not money.

## Privacy and scope

The assistant's consent names the selected provider. The submitted provider must match server configuration; a mismatch requires reloading and consenting again. Gemini calls carry the key in the server `x-goog-api-key` header, not in URLs. Only the current question, public directory fields and fixed topic identifiers are transmitted. No patient profile, report, booking history or conversation history is retrieved for the model.

[Google's unpaid-service terms](https://ai.google.dev/gemini-api/terms) say not to submit sensitive, confidential or personal information; questions/responses may be used for improvement and human review. Use fictional questions only in this tester. The app cannot reliably identify and strip all personal information from arbitrary text, so this free-tier integration is not a gate for accepting real medical histories. Google's terms also prohibit clinical practice/medical-advice uses. Pulse's scope remains directory/navigation and fixed general education, never diagnosis, treatment, prescriptions, report interpretation or clinical actions.

The server asks for structured JSON describing intent, supplied doctor IDs and a supported condition ID. It validates that response, rejects incomplete/blocked/malformed results, filters invented IDs, and returns app-authored replies/source links. No arbitrary Gemini text is displayed as medical advice. No live Gemini response has been verified without a privately configured key.

## Check it

```bash
npm run check:all
npm run release:check
npm run dev
```

`release:check` requires credentials for the selected provider only. It also checks hosted HTTPS and database configuration; a localhost URL is expected to fail the hosted-origin check. It does not prove live Google/Gemini access.

After configuring the key and Google sign-in, open `/assistant`, review consent and ask: **Find general medicine in Karachi**. Confirm results match the directory. Then test the quick-guide fallback. Quota/provider errors produce a safe message; raw provider diagnostics and keys are not logged to the user.

## Learn the files

- `server/configuration.ts`: provider readiness and missing variable names, without returning secrets.
- `server/assistant-provider.ts`: OpenAI/Gemini HTTP formats and response extraction.
- `server/assistant.ts`: consent, shared quotas, database directory, schema validation and fixed replies.
- `app/api/assistant/route.ts`: public provider metadata; authenticated same-origin questions.
- `features/pulse/assistant-page.tsx`: named-provider consent, missing setup state and user interaction.
- `scripts/release-check.mjs`: selected-provider release preflight.
- Backend assistant tests: mocked network requests, privacy, consent mismatch, quota, invalid/blocked output and safe source-based education.

All paths above are under `web/`. Exercise: follow a question from the consent checkbox to the Gemini header and back to the fixed reply. Explain why selecting a model's doctor ID cannot create a booking.
