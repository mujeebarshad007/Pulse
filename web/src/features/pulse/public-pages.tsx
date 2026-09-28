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

export function Landing() {
  const { enter } = useDemo();
  const router = useRouter();
  function explore() {
    enter("patient-jamie");
    router.push("/patient");
  }
  return (
    <div className="pulse-app p-landing">
      <div className="p-public-notice">
        A working frontend demo · Fictional providers and records · No real
        appointments
      </div>
      <header className="p-public-nav">
        <Logo />
        <nav aria-label="Public navigation">
          <Link href="/doctors">Find care</Link>
          <Link href="/library">Health library</Link>
          <Link href="/journey">How it connects</Link>
        </nav>
        <Link className="p-link-button" href="/login">
          Enter demo <Icon name="arrow" size={16} />
        </Link>
      </header>
      <main>
        <section className="p-landing-hero">
          <div className="p-hero-copy">
            <span className="p-announcement">
              <i />A little clarity. A lot of care.
            </span>
            <h1>
              Your care.
              <br />
              Beautifully
              <br />
              <em>connected.</em>
            </h1>
            <p>
              Find a doctor, plan your next physical visit, and keep your lab
              reports within reach. A calmer way to navigate your care.
            </p>
            <div className="p-hero-actions">
              <Button onClick={explore}>
                Explore patient demo <Icon name="arrow" size={18} />
              </Button>
              <Link className="p-link-button secondary" href="/journey">
                Take the guided journey
              </Link>
            </div>
            <span className="p-hero-footnote">
              <Icon name="shield" size={15} />
              Explore freely. Nothing is sent to a provider.
            </span>
          </div>
          <div
            className="p-hero-visual"
            aria-label="Decorative illustration of the appointment interface"
          >
            <div className="p-orbit orbit-one" />
            <div className="p-orbit orbit-two" />
            <div className="p-floating-heart">
              <Icon name="heart" size={32} />
            </div>
            <div className="p-hero-visit">
              <div className="p-visit-top">
                <span className="p-demo-chip">YOUR NEXT STEP</span>
                <Icon name="sparkle" />
              </div>
              <div className="p-hero-avatar">MC</div>
              <h2>Dr. Maya Chen</h2>
              <p>General medicine · Fictional provider</p>
              <div className="p-mini-week">
                {["M", "T", "W", "T", "F"].map((d, i) => (
                  <span className={i === 0 ? "selected" : ""} key={i}>
                    <small>{d}</small>
                    <b>{5 + i}</b>
                  </span>
                ))}
              </div>
              <div className="p-mini-visit">
                <Icon name="calendar" />
                <div>
                  <strong>Monday, 5 October</strong>
                  <small>10:00 AM · Sample availability</small>
                </div>
              </div>
              <span className="p-visit-footer">
                Physical care. A clear path.
              </span>
            </div>
            <div className="p-floating-report">
              <span className="p-report-icon">
                <Icon name="file" />
              </span>
              <div>
                <strong>Everything in its place.</strong>
                <small>A clear view of your reports.</small>
              </div>
              <Icon name="check" size={18} />
            </div>
          </div>
        </section>
        <section className="p-landing-features" aria-labelledby="care-title">
          <div className="p-section-title">
            <div>
              <span className="p-eyebrow">THOUGHTFULLY CONNECTED</span>
              <h2 id="care-title">Less searching. More clarity.</h2>
            </div>
            <p>
              Three connected experiences.
              <br />
              One place to begin.
            </p>
          </div>
          <div className="p-feature-grid">
            {[
              {
                icon: "search" as const,
                title: "Find the right starting point",
                body: "Explore doctor profiles, specialties, locations and sample availability.",
                href: "/doctors",
                link: "Explore doctors",
              },
              {
                icon: "calendar" as const,
                title: "A visit you can follow",
                body: "Request a physical appointment and see its status as the doctor manages it.",
                href: "/journey",
                link: "See the appointment journey",
              },
              {
                icon: "file" as const,
                title: "Reports within reach",
                body: "See how a laboratory prepares a report and the intended patient accesses it.",
                href: "/journey",
                link: "Explore the report journey",
              },
            ].map((f) => (
              <article className="p-panel" key={f.title}>
                <span className="p-feature-icon">
                  <Icon name={f.icon} size={25} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
                <Link className="p-text-link" href={f.href}>
                  {f.link}
                  <Icon name="arrow" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section className="p-landing-end">
          <div>
            <span className="p-eyebrow">EXPLORE BIG PULSE</span>
            <h2>
              See the whole story.
              <br />
              One journey at a time.
            </h2>
          </div>
          <Button onClick={explore}>
            Open the workspace <Icon name="arrow" size={18} />
          </Button>
        </section>
      </main>
      <footer className="p-public-footer">
        <Logo />
        <span>
          Frontend MVP · Built with care, demonstrated with fictional data.
        </span>
        <Link href="/design-preview">Design explorations</Link>
      </footer>
    </div>
  );
}
export function AuthPage({ mode }: { mode: "login" | "register" }) {
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
              ? "Welcome to Big Pulse."
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
