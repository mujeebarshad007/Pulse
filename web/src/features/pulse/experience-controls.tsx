"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const preferenceKey = "pulse-experience";
const preferenceEvent = "pulse-experience-change";
function readPreferences() {
  try {
    return localStorage.getItem(preferenceKey) ?? "quiet";
  } catch {
    return "quiet";
  }
}
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(preferenceEvent, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(preferenceEvent, listener);
  };
}
function subscribeMotion(listener: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

/** Optional presentation feedback only. Never communicates booking success. */
export function ExperienceControls() {
  const preference = useSyncExternalStore(subscribe, readPreferences, () => "quiet");
  const reducedMotion = useSyncExternalStore(subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);
  const sound = preference.includes("sound");
  const paused = preference.includes("paused");
  const audio = useRef<AudioContext | null>(null);
  const enabled = useRef(false);
  const lastSound = useRef(0);
  const [unavailable, setUnavailable] = useState(false);
  const [temporary, setTemporary] = useState<string | null>(null);
  // If storage is blocked, controls still work for this page session.
  const currentSound = temporary === null ? sound : temporary.includes("sound");
  const currentPaused = temporary === null ? paused : temporary.includes("paused");

  function save(nextSound: boolean, nextPaused: boolean) {
    const value = `${nextSound ? "sound" : "quiet"}${nextPaused ? " paused" : ""}`;
    try {
      localStorage.setItem(preferenceKey, value);
      setTemporary(null);
      window.dispatchEvent(new Event(preferenceEvent));
    } catch {
      setTemporary(value);
    }
  }

  const play = useCallback(async () => {
    if (!enabled.current || document.hidden || performance.now() - lastSound.current < 70) return;
    lastSound.current = performance.now();
    try {
      const context = audio.current ?? new AudioContext();
      audio.current = context;
      if (context.state === "suspended") await context.resume();
      if (!enabled.current || context.state !== "running") return;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const now = context.currentTime;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(640, now);
      oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.065);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.08);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    } catch {
      enabled.current = false;
      setUnavailable(true);
    }
  }, []);

  useEffect(() => {
    enabled.current = currentSound;
    if (!currentSound) void audio.current?.suspend().catch(() => {});
    function feedback(event: Event) {
      if (!event.isTrusted || !(event.target instanceof Element)) return;
      const target = event.target.closest("button, a[href], select, input[type=checkbox], input[type=radio], summary, [role=tab]");
      if (!target || target.closest('[data-ui-sound="ignore"]') || target.matches(':disabled, [aria-disabled="true"]')) return;
      const isChoice = target.matches("select, input");
      if ((event.type === "change") !== isChoice) return;
      void play();
    }
    document.addEventListener("click", feedback);
    document.addEventListener("change", feedback);
    return () => {
      document.removeEventListener("click", feedback);
      document.removeEventListener("change", feedback);
    };
  }, [currentSound, play]);

  useEffect(() => {
    document.documentElement.dataset.pulseMotion = currentPaused ? "paused" : "on";
    return () => { delete document.documentElement.dataset.pulseMotion; };
  }, [currentPaused]);
  useEffect(() => () => { void audio.current?.close().catch(() => {}); }, []);

  return (
    <div className="p-experience-controls" role="group" aria-label="Sound and animation preferences" data-ui-sound="ignore">
      <button type="button" aria-pressed={currentSound && !unavailable}
        aria-label={unavailable ? "Sound unavailable in this browser" : "Interface sounds"}
        disabled={unavailable}
        title="Quiet click feedback. No music or medical alerts."
        onClick={() => {
          enabled.current = !currentSound;
          save(!currentSound, currentPaused);
          if (!currentSound) void play();
        }}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M11 4 6 8H3v8h3l5 4V4Z" />
          {currentSound && !unavailable ? <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /> : <path d="m16 9 6 6m0-6-6 6" />}
        </svg>
        <span>{unavailable ? "Sound unavailable" : `Sound ${currentSound ? "on" : "off"}`}</span>
      </button>
      <span className="p-experience-divider" aria-hidden="true" />
      <button type="button" aria-label="Animations" aria-pressed={!currentPaused && !reducedMotion}
        disabled={reducedMotion} title={reducedMotion ? "Reduced motion is enabled in your device settings" : "Pause or play decorative motion"}
        onClick={() => save(currentSound, !currentPaused)}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          {currentPaused || reducedMotion ? <path d="m8 5 11 7-11 7V5Z" /> : <path d="M8 5v14M16 5v14" />}
        </svg>
        <span>{reducedMotion ? "Motion reduced" : `Motion ${currentPaused ? "off" : "on"}`}</span>
      </button>
    </div>
  );
}
