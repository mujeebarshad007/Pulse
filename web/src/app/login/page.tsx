import { AuthPage } from "@/features/pulse/public-pages";
import { authErrorMessage } from "@/features/pulse/auth-feedback";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthPage
      mode="login"
      callbackError={authErrorMessage(
        typeof error === "string" ? error : undefined,
      )}
    />
  );
}
