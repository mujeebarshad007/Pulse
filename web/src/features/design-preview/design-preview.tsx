"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import {
  designDirections,
  sampleDoctors,
  sampleReports,
  type Direction,
} from "./sample-data";
import "./design-preview.css";

type Section = "overview" | "doctors" | "appointments" | "reports" | "library";
const navigation: { id: Section; label: string; icon: IconName }[] = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "doctors", label: "Find a doctor", icon: "search" },
  { id: "appointments", label: "Appointments", icon: "calendar" },
  { id: "reports", label: "Lab reports", icon: "file" },
  { id: "library", label: "Health library", icon: "book" },
];
const titles = {
  overview: [
    "A little clarity. A lot of care.",
    "Your appointments, doctors, and reports. Thoughtfully in one place.",
  ],
  doctors: [
    "Find your next step in care.",
    "Explore fictional doctor profiles in this design sample.",
  ],
  appointments: [
    "Make room for your health.",
    "A sample of how your physical appointments could look.",
  ],
  reports: [
    "Your reports, clearly organized.",
    "Fictional report entries for interface review. No medical results are stored.",
  ],
  library: [
    "Understanding starts here.",
    "A preview of the health information reading experience.",
  ],
};

type Detail = { title: string; description: string; lines: string[] };

function DetailDialog({
  detail,
  close,
}: {
  detail: Detail | null;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (detail) ref.current?.showModal();
    else ref.current?.close();
  }, [detail]);
  return (
    <dialog
      ref={ref}
      className="preview-dialog"
      aria-labelledby="detail-title"
      onCancel={close}
      onClose={close}
    >
      {detail && (
        <>
          <div className="dialog-top">
            <span className="sample-tag">Fictional design sample</span>
            <button
              className="preview-icon-button"
              onClick={close}
              aria-label="Close details"
            >
              <Icon name="close" />
            </button>
          </div>
          <h2 id="detail-title">{detail.title}</h2>
          <p>{detail.description}</p>
          <ul>
            {detail.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="dialog-note">
            <Icon name="shield" />
            <span>
              This is a UI sample. No booking, upload, or account action takes
              place.
            </span>
          </div>
          <button className="preview-button primary" onClick={close}>
            Back to preview
          </button>
        </>
      )}
    </dialog>
  );
}

export function DesignPreview() {
  const [direction, setDirection] = useState<Direction>("glass");
  const [section, setSection] = useState<Section>("overview");
  const [query, setQuery] = useState("");
  const [solid, setSolid] = useState(false);
  const [detail, setDetail] = useState<Detail | null>(null);
  const chosen = designDirections.find((item) => item.id === direction)!;
  const filteredDoctors = sampleDoctors.filter((doctor) =>
    `${doctor.name} ${doctor.specialty} ${doctor.location}`
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  function navigate(next: Section) {
    setSection(next);
    setQuery("");
  }
  function showAppointment() {
    setDetail({
      title: "General medicine appointment",
      description:
        "An example appointment detail layout, using fictional people and places.",
      lines: [
        "Dr. Maya Chen · Northside Clinic",
        "Monday, September 28, 2026 · 10:30 AM",
        "Physical appointment · Fictional confirmation",
        "Confirmation rules and available management actions still need a product decision.",
      ],
    });
  }
  function showReport(report: (typeof sampleReports)[number]) {
    setDetail({
      title: report.title,
      description:
        "This entry demonstrates report metadata and a reading surface. It contains no lab measurements or downloadable report.",
      lines: [
        report.laboratory,
        report.date,
        "The real report viewer will require authenticated, authorized access.",
      ],
    });
  }
  const doctorCards = (
    <div className="doctor-grid">
      {filteredDoctors.map((doctor) => (
        <article className="doctor-card" key={doctor.id}>
          <div className={`doctor-avatar ${doctor.color}`} aria-hidden="true">
            <span>{doctor.initials}</span>
            <i>
              <Icon name="cross" size={12} />
            </i>
          </div>
          <div className="doctor-info">
            <h3>{doctor.name}</h3>
            <p className="doctor-specialty">{doctor.specialty}</p>
            <span>{doctor.experience}</span>
            <p className="doctor-location">
              <Icon name="pin" size={14} />
              {doctor.location}
            </p>
          </div>
          <button
            className="profile-link"
            onClick={() =>
              setDetail({
                title: doctor.name,
                description:
                  "Fictional doctor profile for visual review. These details do not describe a real provider.",
                lines: [
                  doctor.specialty,
                  doctor.qualification,
                  doctor.experience,
                  doctor.location,
                  doctor.availability,
                ],
              })
            }
          >
            View profile <Icon name="arrow" size={16} />
          </button>
        </article>
      ))}
    </div>
  );
  const reportList = (
    <div className="report-list">
      {sampleReports.map((report) => (
        <button
          className="report-row"
          key={report.id}
          onClick={() => showReport(report)}
        >
          <span className="report-icon">
            <Icon name="file" />
          </span>
          <span>
            <strong>{report.title}</strong>
            <small>{report.date}</small>
          </span>
          <Icon name="chevron" size={18} />
        </button>
      ))}
    </div>
  );
  const appointment = (
    <article className="appointment-card">
      <div className="panel-label">
        <span>
          <i className="status-dot" />
          Upcoming appointment
        </span>
        <span className="small-status">Sample</span>
      </div>
      <div className="appointment-person">
        <div className="doctor-avatar peach small" aria-hidden="true">
          MC
        </div>
        <div>
          <h3>Dr. Maya Chen</h3>
          <p>General medicine · Physical visit</p>
        </div>
      </div>
      <div className="appointment-footer">
        <div className="appointment-when">
          <span>
            <Icon name="calendar" size={16} />
            Mon, 28 Sep
          </span>
          <span>
            <Icon name="clock" size={16} />
            10:30 AM
          </span>
        </div>
        <button
          className="preview-icon-button appointment-arrow"
          onClick={showAppointment}
          aria-label="View sample appointment"
        >
          <Icon name="arrow" />
        </button>
      </div>
    </article>
  );

  return (
    <div
      className={`design-preview theme-${direction}${solid ? " reduce-glass" : ""}`}
    >
      <a href="#preview-content" className="skip-link">
        Skip to preview content
      </a>
      <header className="design-toolbar">
        <div className="studio-brand">
          <span className="studio-mark">
            <Icon name="cross" size={17} />
          </span>
          <div>
            <strong>
              Big Pulse <span>Design studio</span>
            </strong>
            <small>Three directions. One care experience.</small>
          </div>
        </div>
        <div
          className="direction-picker"
          role="group"
          aria-label="Choose a design direction"
        >
          {designDirections.map((item) => (
            <button
              key={item.id}
              aria-pressed={direction === item.id}
              onClick={() => setDirection(item.id)}
            >
              <span className={`theme-dot dot-${item.id}`} />
              {item.name}
            </button>
          ))}
        </div>
        <label className="glass-control">
          <input
            type="checkbox"
            checked={solid}
            onChange={(event) => setSolid(event.target.checked)}
          />
          Reduce glass
        </label>
      </header>
      <div className="sample-stage">
        <div className="stage-orb orb-one" aria-hidden="true" />
        <div className="stage-orb orb-two" aria-hidden="true" />
        <div className="workspace">
          <aside className="workspace-sidebar">
            <a
              className="pulse-logo"
              href="#preview-content"
              aria-label="Big Pulse preview"
            >
              <span>
                <Icon name="cross" size={21} />
              </span>
              Big Pulse<span className="logo-period">.</span>
            </a>
            <div className="workspace-switch">
              <span className="workspace-icon">
                <Icon name="heart" size={17} />
              </span>
              <div>
                <strong>Personal workspace</strong>
                <small>Patient experience</small>
              </div>
            </div>
            <p className="nav-caption">YOUR CARE</p>
            <nav aria-label="Sample patient navigation">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  className={
                    section === item.id ? "nav-item active" : "nav-item"
                  }
                  aria-current={section === item.id ? "page" : undefined}
                  onClick={() => navigate(item.id)}
                >
                  <Icon name={item.icon} size={19} />
                  <span>{item.label}</span>
                  {item.id === "appointments" && (
                    <span className="nav-count">1</span>
                  )}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="sample-notice">
                <Icon name="sparkle" size={18} />
                <strong>A glimpse of Big Pulse</strong>
                <p>
                  Fictional data. Explore the design, then choose your
                  direction.
                </p>
                <Link href="/design-system">
                  View UI foundations <Icon name="arrow" size={14} />
                </Link>
              </div>
              <div className="sample-account">
                <span className="account-avatar">JL</span>
                <div>
                  <strong>Jamie Lee</strong>
                  <small>Fictional patient</small>
                </div>
                <span className="account-indicator" />
              </div>
            </div>
          </aside>
          <div className="workspace-body">
            <header className="workspace-topbar">
              <div className="breadcrumb">
                Workspace <Icon name="chevron" size={13} />
                <strong>
                  {navigation.find((item) => item.id === section)?.label}
                </strong>
              </div>
              <span className="preview-mode">
                <i />
                Design preview
              </span>
            </header>
            <main className="workspace-main" id="preview-content" tabIndex={-1}>
              <div className="greeting">
                <span>YOUR HEALTH, WITHIN REACH</span>
                <span className="sample-date">September 2026 · Sample</span>
              </div>
              <div className="page-intro">
                <div>
                  <h1>{titles[section][0]}</h1>
                  <p>{titles[section][1]}</p>
                </div>
                {section === "overview" && (
                  <button
                    className="preview-button primary"
                    onClick={() => navigate("doctors")}
                  >
                    <Icon name="search" size={17} />
                    Find a doctor
                  </button>
                )}
              </div>
              {section === "overview" && (
                <>
                  <div className="overview-top">
                    <section className="care-banner">
                      <span className="eyebrow">A CLEARER PATH TO CARE</span>
                      <h2>
                        Good care starts
                        <br />
                        with the right connection.
                      </h2>
                      <p>Find a doctor for your next physical visit.</p>
                      <button
                        className="banner-link"
                        onClick={() => navigate("doctors")}
                      >
                        Explore doctors <Icon name="arrow" size={18} />
                      </button>
                      <div className="care-art" aria-hidden="true">
                        <div className="art-ring ring-a" />
                        <div className="art-ring ring-b" />
                        <div className="art-disc">
                          <Icon name="cross" size={62} />
                        </div>
                        <span className="art-pill pill-heart">
                          <Icon name="heart" size={20} />
                        </span>
                        <span className="art-pill pill-check">
                          <Icon name="check" size={19} />
                        </span>
                      </div>
                    </section>
                    {appointment}
                  </div>
                  <section className="doctors-section">
                    <div className="section-heading">
                      <div>
                        <h2>Meet your care team</h2>
                        <p>
                          Explore these fictional profiles to try the interface.
                        </p>
                      </div>
                      <button
                        className="text-action"
                        onClick={() => navigate("doctors")}
                      >
                        See all doctors <Icon name="arrow" size={16} />
                      </button>
                    </div>
                    {doctorCards}
                  </section>
                  <div className="overview-bottom">
                    <section className="reports-panel">
                      <div className="section-heading">
                        <h2>Recent lab reports</h2>
                        <button
                          className="text-action"
                          onClick={() => navigate("reports")}
                        >
                          View all <Icon name="arrow" size={15} />
                        </button>
                      </div>
                      {reportList}
                    </section>
                    <section className="library-callout">
                      <span className="library-icon">
                        <Icon name="book" size={22} />
                      </span>
                      <div>
                        <span className="eyebrow">
                          A LITTLE KNOWLEDGE GOES A LONG WAY
                        </span>
                        <h2>Get to know your health.</h2>
                        <p>A space for clear, maintained health information.</p>
                        <button
                          className="text-action"
                          onClick={() => navigate("library")}
                        >
                          Explore the library <Icon name="arrow" size={16} />
                        </button>
                      </div>
                    </section>
                  </div>
                </>
              )}
              {section === "doctors" && (
                <section>
                  <h2 className="sr-only">Sample doctor profiles</h2>
                  <div className="sample-search">
                    <Icon name="search" />
                    <label className="sr-only" htmlFor="doctor-filter">
                      Filter fictional doctors
                    </label>
                    <input
                      id="doctor-filter"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Filter sample doctors by name, specialty, or clinic"
                    />
                    <span>{filteredDoctors.length} profiles</span>
                  </div>
                  {filteredDoctors.length > 0 ? (
                    doctorCards
                  ) : (
                    <div className="empty-state">
                      <Icon name="search" size={30} />
                      <h2>No sample profiles match</h2>
                      <p>Try “Maya”, “Dermatology”, or clear the filter.</p>
                      <button
                        className="preview-button secondary"
                        onClick={() => setQuery("")}
                      >
                        Clear filter
                      </button>
                    </div>
                  )}
                  <p className="fixture-note">
                    This local sample filter demonstrates interaction only. The
                    required specialization, symptom, and location search still
                    needs approved matching rules and real data.
                  </p>
                </section>
              )}
              {section === "appointments" && (
                <div className="standalone-panel">
                  {appointment}
                  <p className="fixture-note">
                    This appointment is fictional. Booking, confirmation, and
                    doctor management are not implemented.
                  </p>
                </div>
              )}
              {section === "reports" && (
                <section className="reports-panel standalone-panel">
                  <div className="section-heading">
                    <h2>Sample reports</h2>
                    <span className="small-status">2 entries</span>
                  </div>
                  {reportList}
                  <p className="fixture-note">
                    Report titles are design fixtures. No uploaded files, lab
                    measurements, or private records exist in this preview.
                  </p>
                </section>
              )}
              {section === "library" && (
                <section className="empty-state library-empty">
                  <span className="library-icon">
                    <Icon name="book" size={28} />
                  </span>
                  <h2>A home for clear health information.</h2>
                  <p>
                    The reading layout is ready for content design. Medical
                    articles will appear after content ownership and review
                    rules are agreed.
                  </p>
                  <span className="small-status">Content not connected</span>
                </section>
              )}
              <footer className="workspace-footer">
                <span>
                  <Icon name="shield" size={14} />
                  Fictional data for design review only
                </span>
                <span>Big Pulse · Interface exploration 01</span>
              </footer>
            </main>
          </div>
        </div>
      </div>
      <footer className="direction-summary" aria-live="polite">
        <div>
          <span>{chosen.subtitle}</span>
          <h2>{chosen.description}</h2>
        </div>
        <p>{chosen.note}</p>
      </footer>
      <DetailDialog detail={detail} close={() => setDetail(null)} />
    </div>
  );
}
