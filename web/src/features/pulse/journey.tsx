"use client";
import { useRouter } from "next/navigation";
import { useDemo } from "./provider";
import { PageTitle, Panel } from "@/components/pulse/primitives";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export function Journey() {
  const { connected, actor, googleReady, loading } = useDemo();
  if (connected)
    return (
      <>
        <PageTitle
          eyebrow="Pulse · TEST TOGETHER"
          title="Explore all Pulse workspaces."
          description="Use separate Google accounts for the patient, doctor, laboratory and content editor. Staff roles are assigned by the owner."
        />
        {!loading && !googleReady && (
          <Panel>
            <h2>Account features are awaiting Google setup</h2>
            <p role="status">
              Everyone can browse doctors and the health library. Appointment,
              report and staff workspaces need sign-in. The app owner must finish
              Google sign-in setup before testers can use these account features.
            </p>
            <Link href="/login" className="p-text-link">View sign-in status →</Link>
          </Panel>
        )}
        <section className="p-section" aria-labelledby="workspace-list-title">
          <h2 id="workspace-list-title">Choose an experience</h2>
          <div className="p-feature-grid">
            {[
              { title: "Doctor discovery", body: "Public access. Search fictional profiles, fees, cities and future slots.", href: "/doctors", link: "Find a doctor" },
              { title: "Patient workspace", body: "Patient sign-in. Edit your profile, request visits, follow appointment status and access your reports.", href: "/patient", link: "Open patient workspace" },
              { title: "Doctor workspace", body: "Doctor role required. Maintain your profile, manage availability and respond to bookings.", href: "/doctor", link: "Open doctor workspace" },
              { title: "Laboratory workspace", body: "Laboratory role required. Match a patient reference and upload private fictional PDF reports.", href: "/laboratory", link: "Open laboratory workspace" },
              { title: "Health library", body: "Public access. Read published entries and follow their original sources.", href: "/library", link: "Read health information" },
              { title: "Editor workspace", body: "Editor role required. Write sourced entries, save drafts and manage publication.", href: "/content", link: "Open editor workspace" },
            ].map((feature) => (
              <Panel key={feature.href}>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
                <Link href={feature.href} className="p-text-link">{feature.link} →</Link>
              </Panel>
            ))}
          </div>
        </section>
        <Panel>
          <h2>Test the complete journey together</h2>
          <ol>
            <li>
              The patient signs in, completes My profile and requests a
              fictional appointment.
            </li>
            <li>
              The assigned doctor signs in on another device and confirms the
              request. The patient sees the new status within 15 seconds or
              after Refresh.
            </li>
            <li>
              The patient shares their profile reference with the laboratory
              tester. The lab uploads a fictional PDF; the patient can download
              it privately.
            </li>
            <li>
              The editor saves a sourced draft and publishes it in the health
              library.
            </li>
          </ol>
          <p>
            Current role: {actor?.role ?? "guest"}. Changing roles requires the
            owner’s server command; it cannot be done in the browser.
          </p>
          <Link href="/account" className="p-link-button">
            Open my workspace
          </Link>
        </Panel>
      </>
    );
  return <DemoJourney />;
}
function DemoJourney() {
  const { state, enter } = useDemo();
  const router = useRouter();
  const requested = state.appointments.find(
    (a) =>
      a.id !== "APT-1001" &&
      a.patientId === "patient-jamie" &&
      a.doctorId === "doctor-maya",
  );
  const reportAdded = state.reports.some(
    (r) =>
      r.patientId === "patient-jamie" &&
      !["REP-1001", "REP-1002"].includes(r.id),
  );
  const edited = state.articles.some((a) => a.edited && a.published);
  const journeys: {
    number: string;
    title: string;
    description: string;
    icon: IconName;
    steps: {
      label: string;
      body: string;
      actor: string;
      href: string;
      done: boolean;
    }[];
  }[] = [
    {
      number: "01",
      title: "From finding care to a confirmed visit.",
      description: "One appointment record, seen from both sides.",
      icon: "calendar",
      steps: [
        {
          label: "Choose a doctor & request a visit",
          body: "Use the patient workspace to request an available sample slot with Dr. Maya Chen.",
          actor: "patient-jamie",
          href: "/doctors/doctor-maya",
          done: !!requested,
        },
        {
          label: "Confirm the request as a doctor",
          body: "Open the same request in Maya’s doctor workspace and confirm it.",
          actor: "doctor-maya",
          href: "/doctor/appointments",
          done:
            !!requested &&
            ["Confirmed", "Completed"].includes(requested.status),
        },
        {
          label: "See the result as a patient",
          body: "Return to Jamie’s appointments. The updated status is already there.",
          actor: "patient-jamie",
          href: "/patient/appointments",
          done: false,
        },
      ],
    },
    {
      number: "02",
      title: "The right report, to the right patient.",
      description: "Prepare, review, and retrieve a fictional report.",
      icon: "file",
      steps: [
        {
          label: "Prepare a sample as the laboratory",
          body: "Choose Jamie Lee, use the generated text sample, and review the patient match.",
          actor: "lab-northside",
          href: "/laboratory/upload",
          done: reportAdded,
        },
        {
          label: "Read it in the patient workspace",
          body: "Find the prepared report, open it, and download the fictional text file.",
          actor: "patient-jamie",
          href: "/patient/reports",
          done: false,
        },
        {
          label: "Compare another patient’s view",
          body: "Avery’s workspace shows Avery’s reports. The frontend demonstration does not replace server security.",
          actor: "patient-avery",
          href: "/patient/reports",
          done: false,
        },
      ],
    },
    {
      number: "03",
      title: "Information that connects to its source.",
      description: "Maintain an entry, then explore the reader’s experience.",
      icon: "book",
      steps: [
        {
          label: "Create or edit a demo entry",
          body: "Use fictional test copy, add a source, and choose whether the entry is visible.",
          actor: "content-editor",
          href: "/content",
          done: edited,
        },
        {
          label: "Read the visible entry",
          body: "Published demo edits appear in the library and remain labelled unreviewed.",
          actor: "patient-jamie",
          href: "/library",
          done: false,
        },
      ],
    },
  ];
  return (
    <>
      <PageTitle
        eyebrow="Pulse JOURNEY WALKTHROUGH"
        title="See how it all connects."
        description="An interactive guide through the demo. Each step takes you to the right workspace; your fictional changes follow you."
      />
      <div className="p-journey-intro">
        <Icon name="sparkle" size={26} />
        <p>
          This is the extra UX feature: a practical way to explore complete
          workflows instead of disconnected screens. Completion marks reflect
          record changes, not a medical outcome.
        </p>
      </div>
      <div className="p-journey-grid">
        {journeys.map((j) => (
          <Panel className="p-journey-card" key={j.number}>
            <header>
              <span className="p-eyebrow">JOURNEY {j.number}</span>
              <span className="p-feature-icon">
                <Icon name={j.icon} />
              </span>
            </header>
            <h2>{j.title}</h2>
            <p>{j.description}</p>
            <ol>
              {j.steps.map((step, i) => (
                <li key={step.label}>
                  <span className={step.done ? "done" : ""}>
                    {step.done ? <Icon name="check" size={15} /> : i + 1}
                  </span>
                  <div>
                    <h3>{step.label}</h3>
                    <p>{step.body}</p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        enter(step.actor);
                        router.push(step.href);
                      }}
                    >
                      {step.done ? "Revisit step" : "Explore step"}
                      <Icon name="arrow" size={15} />
                    </Button>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        ))}
      </div>
    </>
  );
}
