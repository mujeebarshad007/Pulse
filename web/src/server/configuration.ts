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
  if (provider === "none") {
    return { provider: null, label: "Quick guides", ready: false, missing: [] } as const;
  }
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

/** Safe deployment diagnostics: return setting names and explanations, never values. */
export function deploymentProblems(env: Readonly<Record<string, string | undefined>>) {
  const problems: string[] = [];
  const google = googleConfiguration(env);
  if (!google.ready) problems.push(google.missing.length
    ? `Configure: ${google.missing.join(", ")}`
    : "Check BETTER_AUTH_URL and BETTER_AUTH_SECRET.");
  try {
    const origin = new URL(env.BETTER_AUTH_URL!);
    if (origin.protocol !== "https:" || ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname))
      problems.push("BETTER_AUTH_URL must be the public HTTPS site origin.");
    if (env.NETLIFY === "true" && env.CONTEXT === "production" && env.URL && origin.origin !== new URL(env.URL).origin)
      problems.push("BETTER_AUTH_URL must match the primary Netlify site URL to prevent OAuth cookie/callback mismatches.");
  } catch { problems.push("BETTER_AUTH_URL must be a valid public HTTPS origin."); }
  if (!configuredValue(env.DATABASE_URL)) problems.push("Configure DATABASE_URL.");
  if (env.APP_MODE === "demo") problems.push("APP_MODE must be connected for deployment.");
  if (env.NETLIFY === "true" && env.REPORT_STORAGE !== "netlify")
    problems.push("Set REPORT_STORAGE=netlify; function-local report files are not durable.");
  const ai = assistantConfiguration(env);
  if (ai.missing.length) problems.push(`Configure: ${ai.missing.join(", ")}; or set AI_PROVIDER=none to launch without AI.`);
  return problems;
}
