/** Never echo raw provider descriptions, tokens or arbitrary query text. */
export function authErrorMessage(code: string | undefined): string {
  if (!code) return "";
  if (["access_denied", "user_cancelled"].includes(code))
    return "Google sign-in was cancelled. You can try again when ready.";
  if (["state_mismatch", "state_not_found", "state_invalid"].includes(code))
    return "The sign-in attempt expired or its cookie was lost. Open Pulse on its configured address, allow cookies, and start again from this page.";
  if (code === "session_missing")
    return "Pulse could not find a signed-in session. Use the same site address throughout sign-in and allow cookies. If this repeats, ask the owner to check Google configuration.";
  if (["invalid_code", "unable_to_get_user_info"].includes(code))
    return "Google could not complete sign-in. The owner should check the Google client ID, client secret and exact callback address before you retry.";
  return "Sign-in did not complete. Please try again; if it repeats, contact the app owner. No account access was granted.";
}
