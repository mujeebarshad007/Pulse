"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/features/pulse/provider";
import { homeFor } from "@/features/pulse/model";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Account() {
  const { actor, loading, connectionError, refresh } = useDemo();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !connectionError)
      router.replace(
        actor ? homeFor(actor.role) : "/login?error=session_missing",
      );
  }, [actor, loading, connectionError, router]);
  return (
    <main className="pulse-app p-error-page">
      {connectionError ? (
        <section className="p-auth-card">
          <h1>Your workspace could not load</h1>
          <p role="alert">{connectionError}</p>
          <Button onClick={() => void refresh()}>Retry connection</Button>
          <Link href="/login">Return to sign in</Link>
        </section>
      ) : (
        <p role="status">Opening your workspace…</p>
      )}
    </main>
  );
}
