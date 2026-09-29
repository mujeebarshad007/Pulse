"use client";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "./auth-client";
import { useDemo } from "./provider";
import { homeFor } from "./model";
import { Logo, InputError } from "@/components/pulse/primitives";
import { Button } from "@/components/ui/button";

export function GoogleEntry() {
  const { actor, googleReady, loading } = useDemo();
  const [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  async function signIn() {
    setPending(true);
    setError("");
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/account",
      });
      if (result.error) throw new Error(result.error.message);
    } catch {
      setError(
        "Google sign-in could not start. Please try again or contact the app owner.",
      );
      setPending(false);
    }
  }
  return (
    <div className="pulse-app p-auth-page">
      <header className="p-public-nav">
        <Logo />
        <Link href="/">Back to home</Link>
      </header>
      <main className="p-auth-layout">
        <aside className="p-auth-story">
          <span className="p-eyebrow">BIG PULSE · PAKISTAN</span>
          <h1>
            Your care.
            <br />
            One clear place.
          </h1>
          <p>
            Explore fictional Pakistani providers, try appointment requests and
            keep your test reports together.
          </p>
          <small>
            Testing environment. No real appointments or patient documents.
          </small>
        </aside>
        <section className="p-auth-card">
          <span className="p-demo-chip">CONNECTED TESTER APP</span>
          <h2>Welcome to Big Pulse.</h2>
          <p>
            Sign in or create your patient account with Google. Staff access is
            assigned by the owner.
          </p>
          {actor ? (
            <Link className="p-link-button" href={homeFor(actor.role)}>
              Open my workspace
            </Link>
          ) : (
            <Button
              disabled={loading || pending || !googleReady}
              onClick={signIn}
            >
              {pending ? "Opening Google…" : "Continue with Google"}
            </Button>
          )}
          {!loading && !googleReady && (
            <p role="status" className="p-form-note">
              Google sign-in is awaiting owner setup. You can browse the
              fictional directory now.
            </p>
          )}
          <InputError>{error}</InputError>
          <p className="p-auth-disclaimer">
            Google handles your password. Big Pulse requests your basic account
            name and email to identify your account.
          </p>
          <Link className="p-text-link" href="/doctors">
            Browse fictional providers →
          </Link>
        </section>
      </main>
    </div>
  );
}
