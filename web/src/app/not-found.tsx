import Link from "next/link";
export default function NotFound() {
  return (
    <main className="pulse-app p-error-page">
      <div>
        <span className="p-demo-chip">404 / A DIFFERENT PATH</span>
        <h1>This page isn’t here.</h1>
        <p>
          The address may have changed. Return to Pulse and choose the next step
          in your demo journey.
        </p>
        <Link className="p-link-button" href="/">
          Back to Pulse
        </Link>
      </div>
    </main>
  );
}
