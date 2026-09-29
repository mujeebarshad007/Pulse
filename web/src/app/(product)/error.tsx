"use client";
import Link from "next/link";
export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="p-empty" role="alert">
      <h1>This view didn’t load.</h1>
      <p>
        Try loading it again. Reloading the browser will reset fictional
        changes.
      </p>
      <button className="ui-button ui-button--primary" onClick={() => retry()}>
        Try again
      </button>
      <Link className="p-text-link" href="/">
        Return to Pulse
      </Link>
    </div>
  );
}
