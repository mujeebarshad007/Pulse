"use client";

import { createAvatar } from "@bible-strong/avatar-react";
import { useSyncExternalStore } from "react";
import definition from "@/nova.avatar.json";

const Nova = createAvatar(definition);

const subscribeToMotionPreference = (onChange: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const getReducedMotionPreference = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function NovaMascot() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getReducedMotionPreference,
    () => false,
  );

  return (
    <aside className="nova-mascot" aria-label="Nova mascot">
      {prefersReducedMotion ? (
        <Nova
          key="still"
          size={120}
          defaultExpression="neutral"
          ariaLabel="Nova, still expression"
        />
      ) : (
        <Nova
          key="animated"
          size={120}
          defaultAnimation="idle"
          ariaLabel="Nova mascot"
        />
      )}
    </aside>
  );
}
