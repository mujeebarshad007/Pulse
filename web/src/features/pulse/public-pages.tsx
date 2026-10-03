"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useDemo } from "./provider";
import { homeFor, personas } from "./model";
import { Logo, InputError } from "@/components/pulse/primitives";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { GoogleEntry } from "./google-entry";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { connected } = useDemo();
  return connected ? <GoogleEntry /> : <DemoAuthPage mode={mode} />;
}
function DemoAuthPage({ mode }: { mode: "login" | "register" }) {
  const { enter, register, state, notice, clearNotice } = useDemo();
  const router = useRouter();
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    clearNotice();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim().toLowerCase();
    const password = String(f.get("password"));
    if (!email.endsWith(".test")) {
      setError(
        "Use a fictional .test email address, such as jamie@example.test.",
      );
      return;
    }
    if (password.length < 8) {
      setError(
        "Use a made-up password with at least 8 characters for this form preview.",
      );
      return;
    }
    if (mode === "register") {
      if (password !== String(f.get("confirmation"))) {
        setError("The sample passwords do not match.");
        return;
      }
      if (
        register({
          name: String(f.get("name")),
          email,
          city: String(f.get("city")),
          phone: "",
        })
      ) {
        e.currentTarget.reset();
        router.push("/patient");
      }
    } else {
      const p = state.patients.find((p) => p.email.toLowerCase() === email);
      if (!p) {
        setError(
          "No fictional account matches. Try jamie@example.test or create a demo profile.",
        );
        return;
      }
      enter(p.id);
      e.currentTarget.reset();
      router.push("/patient");
    }
  }
  return (
    <div className="pulse-app p-auth-page">
      <header className="p-public-nav">
        <Logo />
        <Link className="p-text-link" href="/">
          Back to home <Icon name="arrow" size={16} />
        </Link>
      </header>
      <main className="p-auth-layout">
        <aside className="p-auth-story">
          <span className="p-eyebrow">CARE, WITH CLARITY</span>
          <h1>
            A more thoughtful
            <br />
            place for your care.
          </h1>
          <p>
            Your next appointment and lab reports, brought together in one clear
            workspace.
          </p>
          <div className="p-auth-art" aria-hidden="true">
            <Icon name="cross" size={95} />
          </div>
          <small>Frontend demo. No real accounts or credentials.</small>
        </aside>
        <section className="p-auth-card">
          <span className="p-demo-chip">DEMO FORM</span>
          <h2>
            {mode === "login"
              ? "Welcome to Pulse."
              : "Your next chapter in care."}
          </h2>
          <p>
            {mode === "login"
              ? "Try the patient sign-in experience."
              : "Create a fictional patient profile for this session."}
          </p>
          <form onSubmit={submit} className="p-form">
            {mode === "register" && (
              <Field id="name" label="Fictional full name">
                <input
                  id="name"
                  name="name"
                  className="ui-input"
                  required
                  minLength={2}
                  maxLength={80}
                  autoComplete="off"
                  placeholder="Alex Demo"
                />
              </Field>
            )}
            <Field
              id="email"
              label="Fictional email"
              hint="Use a .test address. For sign-in: jamie@example.test."
            >
              <input
                id="email"
                name="email"
                type="email"
                className="ui-input"
                required
                maxLength={120}
                aria-describedby="email-hint"
                autoComplete="off"
                placeholder="jamie@example.test"
              />
            </Field>
            {mode === "register" && (
              <Field id="city" label="City">
                <select id="city" name="city" className="ui-input" required>
                  <option value="">Choose a demo city</option>
                  <option>Karachi</option>
                  <option>Lahore</option>
                  <option>Islamabad</option>
                </select>
              </Field>
            )}
            <Field
              id="password"
              label="Made-up password"
              hint="Form preview only: 8+ characters. Never use a real password."
            >
              <input
                id="password"
                name="password"
                type="password"
                className="ui-input"
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                aria-describedby="password-hint"
              />
            </Field>
            {mode === "register" && (
              <Field id="confirmation" label="Repeat made-up password">
                <input
                  id="confirmation"
                  name="confirmation"
                  type="password"
                  className="ui-input"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                />
              </Field>
            )}
            <InputError>
              {error || (notice?.kind === "error" ? notice.text : "")}
            </InputError>
            <Button type="submit">
              {mode === "login" ? "Preview sign in" : "Create demo profile"}
              <Icon name="arrow" size={16} />
            </Button>
          </form>
          <p className="p-auth-disclaimer">
            Passwords are not verified or saved. This previews the form; it does
            not authenticate anyone.
          </p>
          <p className="p-auth-alternate">
            {mode === "login" ? "New to the demo?" : "Already exploring?"}{" "}
            <Link href={mode === "login" ? "/register" : "/login"}>
              {mode === "login" ? "Create a demo profile" : "Preview sign in"}
            </Link>
          </p>
          <div className="p-demo-personas">
            <span>Or skip the form and explore a workspace</span>
            {personas
              .filter((p) => !["patient-avery", "doctor-new"].includes(p.id))
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    enter(p.id);
                    router.push(homeFor(p.role));
                  }}
                >
                  {p.role === "editor" ? "Content maintainer" : p.role}
                  <Icon name="arrow" size={14} />
                </button>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
