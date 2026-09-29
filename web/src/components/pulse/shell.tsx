"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useDemo, type Scenario } from "@/features/pulse/provider";
import { homeFor, personas, type Role } from "@/features/pulse/model";
import { Icon, type IconName } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { EmptyState, Logo, Modal } from "./primitives";

const links: Record<
  Role | "guest",
  { href: string; label: string; icon: IconName }[]
> = {
  patient: [
    { href: "/patient", label: "Overview", icon: "grid" },
    { href: "/doctors", label: "Find a doctor", icon: "search" },
    { href: "/patient/appointments", label: "Appointments", icon: "calendar" },
    { href: "/patient/reports", label: "Lab reports", icon: "file" },
    { href: "/library", label: "Health library", icon: "book" },
    { href: "/patient/profile", label: "My profile", icon: "user" },
  ],
  doctor: [
    { href: "/doctor", label: "Overview", icon: "grid" },
    { href: "/doctor/appointments", label: "Appointments", icon: "calendar" },
    { href: "/doctor/availability", label: "Availability", icon: "clock" },
    { href: "/doctor/profile", label: "Doctor profile", icon: "user" },
  ],
  lab: [
    { href: "/laboratory", label: "Reports overview", icon: "grid" },
    { href: "/laboratory/upload", label: "Prepare report", icon: "upload" },
  ],
  editor: [
    { href: "/content", label: "Content library", icon: "book" },
    { href: "/content/new", label: "Create entry", icon: "plus" },
  ],
  guest: [
    { href: "/doctors", label: "Explore doctors", icon: "search" },
    { href: "/library", label: "Health library", icon: "book" },
    { href: "/login", label: "Sign in", icon: "user" },
  ],
};
export function Gate({ role, children }: { role: Role; children: ReactNode }) {
  const { actor, enter, connected, loading } = useDemo();
  if (loading) return <p role="status">Loading your workspace…</p>;
  if (actor?.role === role) return children;
  if (connected)
    return (
      <EmptyState
        icon="shield"
        title={
          actor
            ? "This workspace requires a different role"
            : "Sign in to continue"
        }
        action={
          <Link
            className="p-link-button"
            href={actor ? homeFor(actor.role) : "/login"}
          >
            {actor ? "My workspace" : "Continue with Google"}
          </Link>
        }
      >
        {actor
          ? "Staff access is assigned by the app owner."
          : "Your account keeps your test appointments and reports together."}
      </EmptyState>
    );
  const persona = personas.find((p) => p.role === role)!;
  return (
    <EmptyState
      icon="shield"
      title={actor ? "This is another workspace" : "Enter a demo workspace"}
      action={
        <Button onClick={() => enter(persona.id)}>
          Continue as {role === "editor" ? "content maintainer" : role}
        </Button>
      }
    >
      {actor
        ? `This screen belongs to the ${role} experience. Switch demo personas to explore it.`
        : "A page refresh ends the demo session. Choose a persona to continue; this is not real sign-in."}
    </EmptyState>
  );
}
export function Workspace({ children }: { children: ReactNode }) {
  const {
    actor,
    state,
    enter,
    leave,
    reset,
    notice,
    clearNotice,
    scenario,
    setScenario,
    solid,
    setSolid,
    connected,
    loading,
    busy,
    refresh,
  } = useDemo();
  const pathname = usePathname();
  const router = useRouter();
  const [resetOpen, setResetOpen] = useState(false);
  const availablePersonas = [
    ...state.patients.map((p) => ({
      id: p.id,
      name: p.name,
      role: "patient" as const,
    })),
    ...personas.filter((p) => p.role !== "patient"),
  ];
  const nav = links[actor?.role ?? "guest"];
  const name =
    actor?.role === "patient"
      ? (state.patients.find((p) => p.id === actor.id)?.name ?? actor.name)
      : (actor?.name ?? "Guest preview");
  const current = nav
    .filter(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
  function changePersona(id: string) {
    const person = availablePersonas.find((p) => p.id === id);
    if (person) {
      enter(id);
      router.push(homeFor(person.role));
    }
  }
  return (
    <div className={`pulse-app ${solid ? "p-solid" : ""}`}>
      <a className="p-skip" href="#main-content">
        Skip to content
      </a>
      <div className="p-demo-ribbon">
        <span>
          <i />
          {connected
            ? "Big Pulse · Testing environment"
            : "Interactive frontend demo"}{" "}
          <span className="ribbon-detail">
            {connected
              ? "· Fictional providers · Saved test records"
              : "· Fictional data · Changes reset on refresh"}
          </span>
        </span>
        {!connected && (
          <details className="p-demo-tools">
            <summary>
              Demo controls <Icon name="sliders" size={14} />
            </summary>
            <div className="p-tools-menu">
              <label>
                Preview as
                <select
                  aria-label="Preview as"
                  className="ui-input"
                  value={
                    availablePersonas.some((p) => p.id === actor?.id)
                      ? actor?.id
                      : ""
                  }
                  onChange={(e) => changePersona(e.target.value)}
                >
                  <option value="" disabled>
                    Choose a persona
                  </option>
                  {availablePersonas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · {p.role}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Review a UI state
                <select
                  className="ui-input"
                  aria-label="Review a UI state"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value as Scenario)}
                >
                  <option value="ready">Normal interface</option>
                  <option value="loading">Loading example</option>
                  <option value="empty">Empty example</option>
                  <option value="error">Error example</option>
                </select>
              </label>
              <label className="p-check">
                <input
                  type="checkbox"
                  checked={solid}
                  onChange={(e) => setSolid(e.target.checked)}
                />
                Reduce glass effects
              </label>
              <Button variant="secondary" onClick={() => setResetOpen(true)}>
                Reset fictional data
              </Button>
              <Link href="/design-preview">Original design samples</Link>
            </div>
          </details>
        )}
        {connected && (
          <button
            className="p-text-link"
            onClick={() => void refresh()}
            disabled={busy}
          >
            Refresh
          </button>
        )}
      </div>
      <div className="p-workspace">
        <aside className="p-sidebar">
          <Logo />
          <div className="p-workspace-label">
            <span className="p-workspace-symbol">
              <Icon name={actor?.role === "lab" ? "file" : "heart"} size={19} />
            </span>
            <div>
              <strong>
                {actor?.role === "editor"
                  ? "Content workspace"
                  : `${actor?.role ?? "Public"} workspace`}
              </strong>
              <small>Care, with clarity.</small>
            </div>
          </div>
          <p className="p-nav-caption">
            {actor?.role === "patient" ? "YOUR CARE" : "WORKSPACE"}
          </p>
          <nav aria-label="Workspace navigation">
            {nav.map((item) => (
              <Link
                href={item.href}
                key={item.href}
                onClick={() => {
                  setScenario("ready");
                  clearNotice();
                }}
                className={`p-nav-link ${current?.href === item.href ? "active" : ""}`}
                aria-current={current?.href === item.href ? "page" : undefined}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-sidebar-bottom">
            <Link href="/journey" className="p-journey-link">
              <Icon name="sparkle" />
              <span>
                <strong>Follow the journey</strong>
                <small>See how Big Pulse connects.</small>
              </span>
              <Icon name="chevron" size={16} />
            </Link>
            <div className="p-user">
              <span className="p-user-avatar">{name.slice(0, 1)}</span>
              <div>
                <strong>{name}</strong>
                <small>
                  {connected ? "Test account · " : "Fictional "}
                  {actor?.role ?? "visitor"}
                </small>
              </div>
              {actor && (
                <button
                  className="p-icon-button"
                  aria-label="Sign out"
                  onClick={async () => {
                    if (await leave()) router.push("/");
                  }}
                >
                  <Icon name="logout" size={18} />
                </button>
              )}
            </div>
          </div>
        </aside>
        <div className="p-main-column">
          <header className="p-topbar">
            <div className="p-breadcrumb">
              Big Pulse <Icon name="chevron" size={13} />
              <span>{current?.label ?? "Care workspace"}</span>
            </div>
            <div className="p-topbar-right">
              <span className="p-demo-chip">
                {connected ? "Saved test environment" : "Demo environment"}
              </span>
              <Link
                href="/journey"
                className="p-icon-button"
                aria-label="Open guided journey"
              >
                <Icon name="sparkle" size={18} />
              </Link>
            </div>
          </header>
          <main id="main-content" tabIndex={-1} className="p-main">
            {notice && (
              <div
                className={`p-notice ${notice.kind}`}
                role={notice.kind === "error" ? "alert" : "status"}
              >
                <Icon
                  name={notice.kind === "error" ? "info" : "check"}
                  size={19}
                />
                <span>{notice.text}</span>
                <button
                  className="p-icon-button"
                  aria-label="Dismiss message"
                  onClick={clearNotice}
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            )}
            {loading ? (
              <p role="status">Loading your workspace…</p>
            ) : scenario === "ready" ? (
              <fieldset
                disabled={busy}
                className="p-operation-boundary"
                aria-busy={busy}
              >
                {children}
              </fieldset>
            ) : (
              <div className="p-state-preview">
                <span className="p-eyebrow">DESIGN QA · SIMULATED STATE</span>
                {scenario === "loading" ? (
                  <>
                    <h1>Loading your workspace…</h1>
                    <div
                      className="p-skeleton-grid"
                      aria-busy="true"
                      aria-label="Sample loading placeholders"
                    >
                      {[1, 2, 3].map((n) => (
                        <div className="p-skeleton" key={n} />
                      ))}
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setScenario("ready")}
                    >
                      End loading preview
                    </Button>
                  </>
                ) : (
                  <EmptyState
                    icon={scenario === "error" ? "info" : "file"}
                    title={
                      scenario === "error"
                        ? "Something didn’t load"
                        : "Nothing here just yet"
                    }
                    action={
                      <Button onClick={() => setScenario("ready")}>
                        {scenario === "error"
                          ? "Try again"
                          : "Return to the demo"}
                      </Button>
                    }
                  >
                    {scenario === "error"
                      ? "This is a simulated failure. Your demo data has not changed."
                      : "This example shows how an empty workspace guides someone to their next action."}
                  </EmptyState>
                )}
              </div>
            )}
            <footer className="p-footer">
              <span>
                <Icon name="shield" size={14} />
                Fictional data. No real healthcare services.
              </span>
              <span>
                {connected
                  ? "Big Pulse / Connected tester app"
                  : "Big Pulse / Frontend MVP"}
              </span>
            </footer>
          </main>
        </div>
      </div>
      <Modal
        open={resetOpen}
        title="Reset this demo?"
        onClose={() => setResetOpen(false)}
      >
        <p>
          Fictional edits, new appointments, and prepared reports will return to
          their starting examples. This cannot be undone within this session.
        </p>
        <div className="p-form-actions">
          <Button variant="secondary" onClick={() => setResetOpen(false)}>
            Keep exploring
          </Button>
          <Button
            onClick={() => {
              reset();
              setResetOpen(false);
              router.push("/");
            }}
          >
            Reset demo
          </Button>
        </div>
      </Modal>
    </div>
  );
}
