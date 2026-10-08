"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDemo } from "./provider";
import { PageTitle, Panel } from "@/components/pulse/primitives";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import type { AssistantReply } from "@/server/assistant";
import { conditionEducation, educationReply } from "./condition-education";

const guides = [
  {
    label: "How do I book a visit?",
    text: "Find a doctor, open their profile, choose an available slot and review your request. Sign in and complete your patient profile first. The doctor confirms or declines your request.",
    href: "/doctors",
    link: "Find a doctor",
  },
  {
    label: "Where are my lab reports?",
    text: "Open My reports after signing in. Your laboratory uses the patient reference from your profile to upload a fictional PDF to your account.",
    href: "/patient/reports",
    link: "My reports",
  },
  {
    label: "How do staff accounts work?",
    text: "Everyone starts as a patient after Google sign-in. The owner assigns doctor, laboratory or editor access to existing accounts.",
    href: "/journey",
    link: "Explore workspaces",
  },
];
type Turn = {
  question: string;
  reply: AssistantReply;
  kind: "AI response" | "Quick guide" | "Sourced education";
};
export function AssistantPage() {
  const { actor, connected } = useDemo();
  const [configured, setConfigured] = useState(false),
    [ready, setReady] = useState(false);
  const [provider, setProvider] = useState<"openai" | "gemini" | null>(null);
  const providerLabel = provider === "gemini" ? "Google Gemini" : provider === "openai" ? "OpenAI" : "the configured AI provider";
  const [question, setQuestion] = useState(""),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const end = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/assistant", { cache: "no-store", signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setConfigured(data.configured === true);
        setProvider(data.provider === "gemini" || data.provider === "openai" ? data.provider : null);
        setReady(true);
      })
      .catch(() => setReady(true));
    return () => {
      controller.abort();
      request.current?.abort();
    };
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({
      block: "nearest",
      behavior: (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.pulseMotion === "paused")
        ? "instant"
        : "smooth",
    });
  }, [turns, busy]);
  async function send(event: FormEvent) {
    event.preventDefault();
    if (busy || !question.trim() || !actor || !consent || !provider) return;
    const message = question.trim();
    setBusy(true);
    setError("");
    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, consent, provider }),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(25000),
        ]),
      });
      const reply = await response.json();
      if (!response.ok)
        throw new Error(reply.error ?? "The assistant is unavailable.");
      setTurns((current) => [
        ...current.slice(-19),
        { question: message, reply, kind: "AI response" },
      ]);
      setQuestion("");
    } catch (cause) {
      if (!controller.signal.aborted)
        setError(
          cause instanceof Error ? cause.message : "Could not send. Try again.",
        );
    } finally {
      setBusy(false);
      request.current = null;
    }
  }
  return (
    <>
      <PageTitle
        eyebrow="PULSE ASSISTANT"
        title="A little help. A clearer next step."
        description="Understand a named condition, explore clinicians and get help with Pulse. General education, never diagnosis."
      />
      <div className="p-assistant-layout">
        <Panel className="p-assistant-intro">
          <div className="p-ai-orb" aria-hidden="true">
            <Icon name="sparkle" size={30} />
          </div>
          <h2>Care, without the confusion.</h2>
          <p>
            Which condition would you like to understand? Read a sourced
            introduction below, or ask a general question after signing in. No
            personal history is needed.
          </p>
          <span className="p-eyebrow">
            CONDITION EDUCATION · NO AI REQUIRED
          </span>
          {conditionEducation.map((item) => (
            <button
              key={item.id}
              className="p-guide-button"
              onClick={() =>
                setTurns((current) => [
                  ...current.slice(-19),
                  {
                    question: `Explain ${item.title}`,
                    reply: educationReply(item.id, item.title),
                    kind: "Sourced education",
                  },
                ])
              }
            >
              {item.title}
              <Icon name="arrow" size={16} />
            </button>
          ))}
          <span className="p-eyebrow">QUICK GUIDES · NO AI REQUIRED</span>
          {guides.map((guide) => (
            <button
              className="p-guide-button"
              key={guide.label}
              onClick={() =>
                setTurns((current) => [
                  ...current.slice(-19),
                  {
                    question: guide.label,
                    kind: "Quick guide",
                    reply: {
                      message: guide.text,
                      doctors: [],
                      links: [{ href: guide.href, label: guide.link }],
                    },
                  },
                ])
              }
            >
              {guide.label}
              <Icon name="arrow" size={16} />
            </button>
          ))}
          <p className="p-form-note">
            No diagnosis, prescriptions or report interpretation. Availability
            is checked again when you book.
          </p>
        </Panel>
        <Panel className="p-chat-panel">
          <header className="p-chat-heading">
            <span>
              <Icon name="sparkle" size={18} /> Pulse assistant
            </span>
            <button
              className="p-text-link"
              disabled={busy}
              onClick={() => {
                setTurns([]);
                setError("");
              }}
            >
              Clear conversation
            </button>
          </header>
          <div
            className="p-chat-transcript"
            role="log"
            aria-label="Conversation"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {!turns.length && (
              <div className="p-chat-welcome">
                <Icon name="sparkle" size={36} />
                <h2>Where shall we start?</h2>
                <p>Choose a quick guide or ask a directory question.</p>
              </div>
            )}
            {turns.map((turn, i) => (
              <div className="p-chat-turn" key={i}>
                <p className="p-chat-question">{turn.question}</p>
                <div className="p-chat-answer">
                  <small>{turn.kind}</small>
                  <p>{turn.reply.message}</p>
                  {turn.reply.doctors.map((d) => (
                    <Link
                      className="p-assistant-doctor"
                      href={`/doctors/${encodeURIComponent(d.id)}`}
                      key={d.id}
                    >
                      <strong>{d.name}</strong>
                      <span>
                        {d.specialty} · {d.city} · PKR{" "}
                        {Number(d.fee).toLocaleString("en-US")}
                      </span>
                      <span>
                        View profile <Icon name="arrow" size={14} />
                      </span>
                    </Link>
                  ))}
                  <div className="p-chat-links">
                    {turn.reply.links.map((link) => (
                      <Link href={link.href} key={link.href}>
                        {link.label} →
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {busy && (
              <p role="status" className="p-chat-thinking">
                Checking your question<span aria-hidden="true">…</span>
              </p>
            )}
            <div ref={end} />
          </div>
          {ready && !configured && (
            <p className="p-form-note" role="status">
              AI is awaiting owner setup. Quick guides work now.
            </p>
          )}
          {!actor && (
            <p className="p-form-note">
              <Link href="/login">Sign in with Google</Link> to use AI
              questions. Quick guides are available to everyone.
            </p>
          )}
          <form onSubmit={send} className="p-chat-form">
            <label htmlFor="assistant-question" className="p-eyebrow">
              YOUR QUESTION
            </label>
            <textarea
              id="assistant-question"
              className="ui-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              minLength={2}
              maxLength={600}
              required
              placeholder="Find a cardiologist in Lahore…"
              disabled={busy}
            />
            <label className="p-chat-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />{" "}
              Send this fictional or general question to {providerLabel}.
              I won’t include personal information, real symptoms, medical
              history or reports.
            </label>
            {provider === "gemini" && (
              <p className="p-form-note">
                Google’s unpaid service may use questions and responses for product improvement and human review. Use fictional examples only.
                {" "}<a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noreferrer">Google data terms</a>
              </p>
            )}
            {error && (
              <p role="alert" className="p-input-error">
                {error}
              </p>
            )}
            <div className="p-chat-actions">
              <small>
                Conversation stays in this tab. Each question is handled
                independently.
              </small>
              <Button
                disabled={
                  busy ||
                  !ready ||
                  !configured ||
                  !provider ||
                  !actor ||
                  !consent ||
                  !connected
                }
                type="submit"
              >
                {busy ? "Thinking…" : "Ask Pulse"}
                <Icon name="arrow" size={16} />
              </Button>
            </div>
          </form>
        </Panel>
      </div>
    </>
  );
}
