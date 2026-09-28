"use client";
import { useRouter } from "next/navigation";
import { useDemo } from "./provider";
import { PageTitle, Panel } from "@/components/pulse/primitives";
import { Icon, type IconName } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export function Journey() {
  const { state, enter } = useDemo();
  const router = useRouter();
  const requested = state.appointments.find(
    (a) => a.id !== "APT-1001" && a.patientId === "patient-jamie" && a.doctorId === "doctor-maya",
  );
  const reportAdded = state.reports.some(
    (r) => r.patientId === "patient-jamie" && !["REP-1001", "REP-1002"].includes(r.id),
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
        eyebrow="BIG PULSE JOURNEY WALKTHROUGH"
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
