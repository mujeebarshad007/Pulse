// Check presence without ever returning credential values in diagnostics.
export function configuredValue(value: string | undefined): boolean {
  return (
    !!value?.trim() &&
    !/(\byour\b|your[-_ ]|replace[-_ ]|placeholder|^<.*>$)/i.test(value.trim())
  );
}

export function googleConfiguration(
  env: Readonly<Record<string, string | undefined>>,
) {
  const keys = [
    "BETTER_AUTH_URL",
    "BETTER_AUTH_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ] as const;
  const missing = keys.filter((key) => !configuredValue(env[key]));
  if (missing.length) return { ready: false, missing };
  try {
    const url = new URL(env.BETTER_AUTH_URL!);
    const local = ["localhost", "127.0.0.1"].includes(url.hostname);
    return {
      ready:
        env.BETTER_AUTH_SECRET!.length >= 32 &&
        !url.username &&
        !url.password &&
        url.pathname === "/" &&
        !url.search &&
        !url.hash &&
        (url.protocol === "https:" || (url.protocol === "http:" && local)),
      missing,
    };
  } catch {
    return { ready: false, missing };
  }
}

/** Returns public readiness metadata only, never keys or model credentials. */
export function assistantConfiguration(
  env: Readonly<Record<string, string | undefined>> = process.env,
) {
  const provider = env.AI_PROVIDER ?? "openai";
  if (provider !== "openai" && provider !== "gemini") {
    return { provider: null, label: "AI provider", ready: false, missing: ["AI_PROVIDER"] } as const;
  }
  const keys = provider === "gemini"
    ? ["GEMINI_API_KEY", "GEMINI_MODEL"]
    : ["OPENAI_API_KEY", "OPENAI_MODEL"];
  const missing = keys.filter((key) => !configuredValue(env[key]));
  if (provider === "gemini" && configuredValue(env.GEMINI_MODEL) &&
      !/^gemini-[a-z0-9.-]+$/.test(env.GEMINI_MODEL!)) missing.push("GEMINI_MODEL");
  return { provider, label: provider === "gemini" ? "Google Gemini" : "OpenAI", ready: missing.length === 0, missing } as const;
}
