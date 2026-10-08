"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/pulse/primitives";
import { Icon, type IconName } from "@/components/ui/icon";
import { HeartVisual } from "./heart-visual";
import { useDemo } from "./provider";

const services: {
  icon: IconName;
  title: string;
  description: string;
  href: string;
  tag: string;
}[] = [
  {
    icon: "file",
    title: "Your laboratory visit.",
    description:
      "Explore test offerings, review preparation details and request a laboratory-confirmed visit.",
    href: "/labs",
    tag: "LAB TESTS",
  },
  {
    icon: "search",
    title: "Find your doctor.",
    description:
      "Explore specialties, cities and clear fee information. Choose who feels right for you.",
    href: "/doctors",
    tag: "DISCOVER",
  },
  {
    icon: "calendar",
    title: "Make room for care.",
    description:
      "Request a visit. Follow its status. Keep every appointment in one calm space.",
    href: "/patient/appointments",
    tag: "PLAN",
  },
  {
    icon: "file",
    title: "Your reports. Together.",
    description:
      "Private lab PDFs, organized and available to the right patient after sign-in.",
    href: "/patient/reports",
    tag: "KEEP",
  },
  {
    icon: "sparkle",
    title: "A clearer next step.",
    description:
      "Ask Pulse to find a directory profile or explain how things work. No medical advice.",
    href: "/assistant",
    tag: "ASK PULSE",
  },
];
export function Landing() {
  const { state, actor, loading } = useDemo();
  const router = useRouter();
  const [query, setQuery] = useState(""),
    [city, setCity] = useState("");
  function search(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city) params.set("city", city);
    router.push(`/doctors?${params}`);
  }
  const specialties = [...new Set(state.doctors.map((d) => d.specialty))];
  return (
    <div className="pulse-app pulse-next-home">
      <a className="p-skip" href="#home-main">
        Skip to content
      </a>
      <div className="pn-preview">
        <span /> Fictional-data preview{" "}
        <span className="pn-preview-separator">/</span> Explore the future of
        your care.
      </div>
      <header className="pn-nav">
        <Logo />
        <nav aria-label="Main navigation">
          <Link href="/doctors">Find a doctor</Link>
          <Link href="/labs">Lab tests</Link>
          <Link href="/library">Health library</Link>
          <Link href="/assistant">
            Ask Pulse <Icon name="sparkle" size={13} />
          </Link>
        </nav>
        <Link className="pn-nav-action" href={actor ? "/account" : "/login"}>
          {actor ? "My workspace" : "Get started"}
          <Icon name="arrow" size={16} />
        </Link>
      </header>
      <main id="home-main">
        <section className="pn-hero">
          <div className="pn-hero-copy">
            <span className="pn-kicker">
              <span className="pn-live-dot" /> YOUR CARE, IN SYNC
            </span>
            <h1>
              A healthier
              <br />
              kind of
              <br />
              <span>connection.</span>
            </h1>
            <p>
              Good care starts with a little clarity. Find a doctor, plan a
              visit, and keep your health journey together.
            </p>
            <div className="pn-hero-links">
              <a className="p-link-button" href="#find-care">
                Find your next step <Icon name="arrow" size={17} />
              </a>
              <Link className="pn-quiet-link" href="/journey">
                Explore Pulse <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="pn-hero-caption">
              <Icon name="shield" size={15} />
              <span>Made for Pakistan. Built around you.</span>
            </div>
          </div>
          <div
            className="pn-hero-art"
            aria-label="Illustration of connected care; sample information"
          >
            <div className="pn-orb">
              <div className="pn-orb-ring" />
              <div className="pn-orb-heart">
                <HeartVisual />
              </div>
              <span className="pn-orb-label">a little closer to care</span>
            </div>
            <div className="pn-float-card pn-float-doctor">
              <span className="pn-person-icon">AK</span>
              <div>
                <small>YOUR CARE NETWORK</small>
                <strong>Dr. Ayesha Khan</strong>
                <span>General medicine · Fictional</span>
              </div>
              <span className="pn-card-arrow">
                <Icon name="arrow" size={17} />
              </span>
            </div>
            <div className="pn-float-card pn-float-visit">
              <span className="pn-symbol">
                <Icon name="calendar" size={23} />
              </span>
              <div>
                <small>ONE CLEAR NEXT STEP</small>
                <strong>A visit that fits your day.</strong>
                <span>Choose from current sample slots</span>
              </div>
            </div>
            <div className="pn-float-card pn-float-file">
              <Icon name="file" size={20} />
              <span>
                Private reports.
                <br />
                <strong>Peace of mind.</strong>
              </span>
              <Icon name="shield" size={18} />
            </div>
            <span className="pn-art-note">
              Interface illustration · No real healthcare services
            </span>
          </div>
        </section>
        <section
          className="pn-search-wrap"
          id="find-care"
          aria-labelledby="find-care-title"
        >
          <div className="pn-search-top">
            <h2 id="find-care-title">Your next step starts here.</h2>
            <span>Simple search. Clear choices.</span>
          </div>
          <form className="pn-search" onSubmit={search}>
            <label>
              <Icon name="search" size={21} />
              <span className="sr-only">Doctor name or specialty</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                maxLength={100}
                placeholder="Doctor name or specialty"
              />
            </label>
            <label>
              <Icon name="pin" size={20} />
              <span className="sr-only">City</span>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">All cities</option>
                {[...new Set(state.doctors.map((d) => d.city))].map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>
            <button className="p-link-button" type="submit">
              Find care <Icon name="arrow" size={18} />
            </button>
          </form>
          <div className="pn-specialties">
            <span>EXPLORE</span>
            {specialties.map((s) => (
              <Link
                key={s}
                href={`/doctors?specialty=${encodeURIComponent(s)}`}
              >
                {s}
                <Icon name="arrow" size={13} />
              </Link>
            ))}
            {loading && <span role="status">Loading specialties…</span>}
          </div>
        </section>
        <section className="pn-services" aria-labelledby="services-title">
          <div className="pn-section-heading">
            <div>
              <span className="pn-kicker">LESS FRICTION. MORE CLARITY.</span>
              <h2 id="services-title">
                All the little things.
                <br />
                Connected.
              </h2>
            </div>
            <p>
              From the first search to the next visit.
              <br />A place for every step.
            </p>
          </div>
          <div className="pn-service-grid">
            {services.map((service, i) => (
              <Link
                className={`pn-service pn-service-${i}`}
                href={service.href}
                key={service.href}
              >
                <div className="pn-service-top">
                  <span className="pn-symbol">
                    <Icon name={service.icon} size={24} />
                  </span>
                  <Icon name="arrow" size={20} />
                </div>
                <small>{service.tag}</small>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="pn-assistant-feature">
          <div className="pn-assistant-art" aria-hidden="true">
            <div className="p-ai-orb">
              <Icon name="sparkle" size={48} />
            </div>
            <span className="pn-prompt-bubble">
              “Find a dermatologist in Karachi.”
            </span>
          </div>
          <div>
            <span className="pn-kicker">MEET YOUR PULSE ASSISTANT</span>
            <h2>
              A little guidance.
              <br />A lot less guessing.
            </h2>
            <p>
              Ask in your own words. Get directory matches and help with Pulse,
              with a clear path to the next screen. You stay in control.
            </p>
            <Link href="/assistant" className="p-link-button">
              Ask Pulse <Icon name="sparkle" size={17} />
            </Link>
            <small>
              AI requires sign-in and owner setup. Quick guides are available
              now.
            </small>
          </div>
        </section>
        <section className="pn-workspaces">
          <div className="pn-section-heading">
            <div>
              <span className="pn-kicker">CARE TAKES A TEAM</span>
              <h2>A space for everyone.</h2>
            </div>
            <Link className="pn-quiet-link" href="/journey">
              How it connects <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="pn-role-grid">
            {[
              {
                title: "For patients",
                text: "Your visits, profile and private reports.",
                href: "/patient",
                icon: "heart",
              },
              {
                title: "For doctors",
                text: "Your schedule, profile and appointments.",
                href: "/doctor",
                icon: "calendar",
              },
              {
                title: "For laboratories",
                text: "A secure path from your lab to the patient.",
                href: "/laboratory",
                icon: "file",
              },
              {
                title: "For editors",
                text: "Sourced information. Thoughtfully maintained.",
                href: "/content",
                icon: "book",
              },
            ].map((role) => (
              <Link key={role.href} href={role.href}>
                <Icon name={role.icon as IconName} size={22} />
                <h3>{role.title}</h3>
                <p>{role.text}</p>
                <span>
                  Open workspace <Icon name="arrow" size={15} />
                </span>
              </Link>
            ))}
          </div>
          <p className="pn-role-note">
            Account features require Google sign-in. Staff access is assigned by
            the owner.
          </p>
        </section>
        <section className="pn-closing">
          <span className="pn-kicker">YOUR NEXT CHAPTER</span>
          <h2>
            Feel more
            <br />
            <em>connected.</em>
          </h2>
          <Link href="/login" className="p-link-button">
            Continue with Google <Icon name="arrow" size={18} />
          </Link>
          <p>Fictional providers and test documents only.</p>
        </section>
      </main>
      <footer className="pn-footer">
        <Logo />
        <p>Care, with clarity.</p>
        <nav aria-label="Footer navigation">
          <Link href="/journey">Workspaces</Link>
          <Link href="/assistant">Assistant</Link>
          <Link href="/library">Library</Link>
        </nav>
        <small>Pulse · Connected tester app</small>
      </footer>
    </div>
  );
}
