import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

export const metadata = { title: "Big Pulse — Design system" };

export default function DesignSystemPage() {
  return (
    <main className="design-catalog">
      <Link className="catalog-back" href="/">
        ← Back to Big Pulse
      </Link>
      <header className="catalog-heading">
        <Badge tone="blue">Big Pulse / Interface foundations</Badge>
        <h1>
          A clear system.
          <br />A calmer experience.
        </h1>
        <p>
          The visual language for Big Pulse: considered typography, useful space,
          and a consistent set of controls. This page is a component reference,
          not a healthcare workflow.
        </p>
      </header>
      <section className="catalog-section" aria-labelledby="palette-title">
        <div>
          <span className="catalog-number">01</span>
          <h2 id="palette-title">Color & hierarchy</h2>
          <p>
            Neutral surfaces keep information readable. Blue identifies the
            primary action.
          </p>
        </div>
        <div className="palette-grid">
          {[
            ["Ink", "#14213d"],
            ["Primary", "#315efb"],
            ["Muted", "#64748b"],
            ["Surface", "#f6f8fc"],
          ].map(([name, color]) => (
            <div className="palette-item" key={name}>
              <div style={{ background: color }} />
              <strong>{name}</strong>
              <span>{color}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="catalog-section" aria-labelledby="controls-title">
        <div>
          <span className="catalog-number">02</span>
          <h2 id="controls-title">Actions & feedback</h2>
          <p>
            Examples of visual states. These reference buttons do not submit
            data.
          </p>
        </div>
        <div className="catalog-stack">
          <div className="catalog-row">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary action</Button>
            <Button variant="quiet">Quiet action</Button>
            <Button disabled>Unavailable</Button>
          </div>
          <div className="catalog-row">
            <Badge>Neutral</Badge>
            <Badge tone="blue">Information</Badge>
            <Badge tone="green">Success</Badge>
            <Badge tone="amber">Attention</Badge>
          </div>
        </div>
      </section>
      <section className="catalog-section" aria-labelledby="forms-title">
        <div>
          <span className="catalog-number">03</span>
          <h2 id="forms-title">Forms that explain themselves</h2>
          <p>
            Visible labels, useful hints, and clear errors. Never rely on color
            alone.
          </p>
        </div>
        <div className="catalog-fields">
          <Field
            id="reference-name"
            label="Example text field"
            hint="A reference control; nothing here is saved."
          >
            <input
              className="ui-input"
              id="reference-name"
              placeholder="Enter example text"
              aria-describedby="reference-name-hint"
              autoComplete="off"
            />
          </Field>
          <Field
            id="reference-error"
            label="Example invalid field"
            error="Explain what needs to change and how to fix it."
          >
            <input
              className="ui-input"
              id="reference-error"
              defaultValue="Example input"
              aria-invalid="true"
              aria-describedby="reference-error-error"
              autoComplete="off"
            />
          </Field>
        </div>
      </section>
      <footer className="catalog-footer">
        Big Pulse design reference · Responsive by design · Keyboard focus included
      </footer>
    </main>
  );
}
