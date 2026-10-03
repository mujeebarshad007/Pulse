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
