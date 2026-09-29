/** Pure, in-memory DEMO rules. These proposals are not production authorization. */
export type Role = "patient" | "doctor" | "lab" | "editor";
export type Actor = {
  id: string;
  name: string;
  role: Role;
  accountId?: string;
};
export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
};
export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: number;
  clinic: string;
  city: string;
  fee: number;
  about: string;
  symptoms: string[];
  color: string;
};
export type Slot = { id: string; doctorId: string; date: string; time: string };
export type AppointmentStatus =
  | "Requested"
  | "Confirmed"
  | "Completed"
  | "Declined";
export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  slotId: string;
  status: AppointmentStatus;
};
export type Report = {
  id: string;
  patientId: string;
  title: string;
  laboratory: string;
  date: string;
  fileName: string;
  content: string;
};
export type Article = {
  id: string;
  title: string;
  category: string;
  summary: string;
  symptoms: string;
  source: string;
  published: boolean;
  edited: boolean;
};
export type DemoState = {
  patients: Patient[];
  doctors: Doctor[];
  slots: Slot[];
  appointments: Appointment[];
  reports: Report[];
  articles: Article[];
  nextId: number;
};
export const DEMO_DATES = [
  "2026-10-05",
  "2026-10-06",
  "2026-10-07",
  "2026-10-08",
  "2026-10-09",
];
export const DEMO_TIMES = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
];
export const personas: Actor[] = [
  { id: "patient-jamie", name: "Jamie Lee", role: "patient" },
  { id: "patient-avery", name: "Avery Morgan", role: "patient" },
  { id: "doctor-maya", name: "Dr. Maya Chen", role: "doctor" },
  { id: "doctor-new", name: "New doctor profile", role: "doctor" },
  { id: "lab-northside", name: "Northside Laboratory", role: "lab" },
  { id: "content-editor", name: "Content maintainer", role: "editor" },
];
export const homeFor = (role: Role) =>
  ({
    patient: "/patient",
    doctor: "/doctor",
    lab: "/laboratory",
    editor: "/content",
  })[role];
export function initialState(): DemoState {
  const doctors: Doctor[] = [
    {
      id: "doctor-maya",
      name: "Dr. Maya Chen",
      specialty: "General medicine",
      qualifications: "MBBS · General medicine",
      experience: 12,
      clinic: "Northside Clinic",
      city: "Karachi",
      fee: 2500,
      about:
        "A fictional general medicine profile for exploring a clear, personal care experience.",
      symptoms: ["headache", "fatigue"],
      color: "peach",
    },
    {
      id: "doctor-adam",
      name: "Dr. Adam Noor",
      specialty: "Dermatology",
      qualifications: "MBBS · Dermatology",
      experience: 8,
      clinic: "Riverside Clinic",
      city: "Karachi",
      fee: 3000,
      about:
        "A fictional skin care specialist. Profile details and availability are demonstration data.",
      symptoms: ["itchy skin", "rash"],
      color: "blue",
    },
    {
      id: "doctor-sara",
      name: "Dr. Sara Ellis",
      specialty: "Cardiology",
      qualifications: "MBBS · Cardiology",
      experience: 15,
      clinic: "Park Medical Centre",
      city: "Lahore",
      fee: 4000,
      about:
        "A fictional cardiology profile created to demonstrate doctor discovery and appointments.",
      symptoms: ["palpitations"],
      color: "lilac",
    },
    {
      id: "doctor-owen",
      name: "Dr. Owen Shah",
      specialty: "General medicine",
      qualifications: "MBBS · General medicine",
      experience: 6,
      clinic: "Cedar Clinic",
      city: "Islamabad",
      fee: 2000,
      about:
        "A fictional general medicine profile. No real consultation or medical service is offered in this demo.",
      symptoms: ["headache", "fatigue"],
      color: "mint",
    },
    {
      id: "doctor-leila",
      name: "Dr. Leila Rose",
      specialty: "Dermatology",
      qualifications: "MBBS · Dermatology",
      experience: 10,
      clinic: "Cedar Clinic",
      city: "Lahore",
      fee: 3500,
      about:
        "A fictional dermatology profile for testing profile detail and booking interfaces.",
      symptoms: ["itchy skin", "rash"],
      color: "rose",
    },
  ];
  return {
    patients: [
      {
        id: "patient-jamie",
        name: "Jamie Lee",
        email: "jamie@example.test",
        phone: "",
        city: "Karachi",
      },
      {
        id: "patient-avery",
        name: "Avery Morgan",
        email: "avery@example.test",
        phone: "",
        city: "Lahore",
      },
    ],
    doctors,
    slots: doctors.flatMap((d) =>
      DEMO_DATES.flatMap((date) =>
        ["09:00", "10:00", "14:00"].map((time) => ({
          id: `${d.id}-${date}-${time}`,
          doctorId: d.id,
          date,
          time,
        })),
      ),
    ),
    appointments: [
      {
        id: "APT-1001",
        patientId: "patient-jamie",
        doctorId: "doctor-maya",
        slotId: "doctor-maya-2026-10-05-09:00",
        status: "Confirmed",
      },
    ],
    reports: [
      {
        id: "REP-1001",
        patientId: "patient-jamie",
        title: "Complete blood count",
        laboratory: "Northside Laboratory",
        date: "2026-09-24",
        fileName: "sample-blood-count.txt",
        content:
          "Pulse — FICTIONAL REPORT\nPatient: Jamie Lee (demo)\nReport: Complete blood count\n\nThis file is a design fixture. It contains no clinical measurements, interpretations, or medical advice.",
      },
      {
        id: "REP-1002",
        patientId: "patient-avery",
        title: "Lipid profile",
        laboratory: "Northside Laboratory",
        date: "2026-09-25",
        fileName: "sample-lipid-profile.txt",
        content:
          "Pulse — FICTIONAL REPORT\nPatient: Avery Morgan (demo)\n\nThis example contains no clinical measurements or medical interpretation.",
      },
    ],
    articles: [
      {
        id: "blood-pressure",
        title: "Understanding high blood pressure",
        category: "Heart health",
        summary:
          "High blood pressure often has no noticeable symptoms. A blood pressure measurement is needed to find out whether it is high.",
        symptoms:
          "Usually no symptoms. Symptoms alone cannot confirm high blood pressure.",
        source: "https://www.nhs.uk/conditions/high-blood-pressure/",
        published: true,
        edited: false,
      },
      {
        id: "eczema",
        title: "An introduction to atopic eczema",
        category: "Skin health",
        summary:
          "Atopic eczema is a skin condition that can cause itching and dry or cracked skin. Its appearance can vary with skin tone.",
        symptoms:
          "Itching; dry or cracked skin; changes in skin color. These can have other causes.",
        source: "https://www.nhs.uk/conditions/atopic-eczema/",
        published: true,
        edited: false,
      },
      {
        id: "diabetes",
        title: "What is type 2 diabetes?",
        category: "Everyday health",
        summary:
          "Type 2 diabetes involves insulin not working properly or being insufficient, causing blood glucose to become too high.",
        symptoms:
          "See the source for symptoms and diagnosis. This entry is an introductory summary.",
        source: "https://www.nhs.uk/conditions/type-2-diabetes/",
        published: true,
        edited: false,
      },
    ],
    nextId: 1003,
  };
}
export function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
}
export function dateLabel(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
export function availableSlots(state: DemoState, doctorId: string) {
  return state.slots
    .filter(
      (s) =>
        s.doctorId === doctorId &&
        !state.appointments.some(
          (a) => a.slotId === s.id && a.status !== "Declined",
        ),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}
export function findDoctors(
  doctors: Doctor[],
  filters: { query: string; specialty: string; city: string; symptom: string },
) {
  const query = filters.query.trim().toLocaleLowerCase();
  return doctors.filter(
    (d) =>
      (!query ||
        `${d.name} ${d.specialty} ${d.clinic}`
          .toLocaleLowerCase()
          .includes(query)) &&
      (!filters.specialty || d.specialty === filters.specialty) &&
      (!filters.city || d.city === filters.city) &&
      (!filters.symptom || d.symptoms.includes(filters.symptom)),
  );
}
export function ownReports(state: DemoState, actor: Actor | null) {
  return actor?.role === "patient"
    ? state.reports.filter((r) => r.patientId === actor.id)
    : [];
}
export function profileComplete(patient: Patient | undefined) {
  return (
    !!patient &&
    patient.name.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email) &&
    !!patient.city.trim()
  );
}
export function validSource(source: string) {
  try {
    return new URL(source).protocol === "https:";
  } catch {
    return false;
  }
}
export type Command =
  | { type: "profile"; patient: Patient }
  | { type: "doctor"; doctor: Doctor }
  | { type: "slot-add"; date: string; time: string }
  | { type: "slot-remove"; id: string }
  | { type: "book"; doctorId: string; slotId: string }
  | { type: "appointment"; id: string; status: AppointmentStatus }
  | {
      type: "report";
      patientId: string;
      title: string;
      content: string;
      fileName: string;
    }
  | { type: "article"; article: Article };
export type Result = { ok: boolean; state: DemoState; message: string };
export function applyCommand(
  state: DemoState,
  actor: Actor | null,
  command: Command,
): Result {
  const fail = (message: string): Result => ({ ok: false, state, message });
  const pass = (changes: Partial<DemoState>, message: string): Result => ({
    ok: true,
    state: { ...state, ...changes },
    message,
  });
  if (!actor) return fail("Enter a demo workspace before making changes.");
  switch (command.type) {
    case "profile": {
      if (actor.role !== "patient" || command.patient.id !== actor.id)
        return fail("This profile belongs to another demo user.");
      const patient = {
        ...command.patient,
        name: command.patient.name.trim(),
        email: command.patient.email.trim(),
        city: command.patient.city.trim(),
        phone: command.patient.phone.trim(),
      };
      if (
        !profileComplete(patient) ||
        patient.name.length > 80 ||
        patient.email.length > 120 ||
        patient.city.length > 60 ||
        patient.phone.length > 30
      )
        return fail(
          "Add a name, valid email, and city within the field limits.",
        );
      if (!state.patients.some((p) => p.id === actor.id))
        return fail("This demo patient no longer exists.");
      return pass(
        {
          patients: state.patients.map((p) =>
            p.id === actor.id ? patient : p,
          ),
        },
        "Profile updated for this demo session.",
      );
    }
    case "doctor": {
      const d = command.doctor;
      if (actor.role !== "doctor" || d.id !== actor.id)
        return fail("You can edit only your own demo doctor profile.");
      if (
        [d.name, d.specialty, d.qualifications, d.clinic, d.city, d.about].some(
          (v) => !v.trim(),
        ) ||
        d.name.length > 80 ||
        d.about.length > 1000 ||
        !Number.isFinite(d.fee) ||
        d.fee < 0 ||
        d.fee > 100000 ||
        !Number.isInteger(d.experience) ||
        d.experience < 0 ||
        d.experience > 70
      )
        return fail("Check the required profile fields, experience, and fee.");
      const doctor = {
        ...d,
        name: d.name.trim(),
        city: d.city.trim(),
        clinic: d.clinic.trim(),
      };
      return pass(
        {
          doctors: state.doctors.some((p) => p.id === actor.id)
            ? state.doctors.map((p) => (p.id === actor.id ? doctor : p))
            : [...state.doctors, doctor],
        },
        "Doctor profile saved in the demo directory.",
      );
    }
    case "slot-add": {
      if (
        actor.role !== "doctor" ||
        !state.doctors.some((d) => d.id === actor.id)
      )
        return fail("Create your doctor profile before adding availability.");
      if (
        !DEMO_DATES.includes(command.date) ||
        !DEMO_TIMES.includes(command.time)
      )
        return fail("Choose a date and time in the sample week.");
      const id = `${actor.id}-${command.date}-${command.time}`;
      if (state.slots.some((s) => s.id === id))
        return fail("That time already exists. Choose another slot.");
      return pass(
        {
          slots: [
            ...state.slots,
            { id, doctorId: actor.id, date: command.date, time: command.time },
          ],
        },
        "Availability added. Patients can see it in the demo.",
      );
    }
    case "slot-remove": {
      const slot = state.slots.find((s) => s.id === command.id);
      if (actor.role !== "doctor" || slot?.doctorId !== actor.id)
        return fail("This is not your availability slot.");
      if (state.appointments.some((a) => a.slotId === command.id))
        return fail(
          "A slot referenced by an appointment is preserved in this prototype.",
        );
      return pass(
        { slots: state.slots.filter((s) => s.id !== command.id) },
        "Availability removed from this demo.",
      );
    }
    case "book": {
      if (actor.role !== "patient")
        return fail("Only the patient demo can request a visit.");
      if (!profileComplete(state.patients.find((p) => p.id === actor.id)))
        return fail("Complete your demo profile before requesting a visit.");
      if (!state.doctors.some((d) => d.id === command.doctorId))
        return fail("This doctor is no longer in the demo directory.");
      if (
        !availableSlots(state, command.doctorId).some(
          (s) => s.id === command.slotId,
        )
      )
        return fail("That slot is no longer available. Choose another time.");
      return pass(
        {
          appointments: [
            ...state.appointments,
            {
              id: `APT-${state.nextId}`,
              doctorId: command.doctorId,
              patientId: actor.id,
              slotId: command.slotId,
              status: "Requested",
            },
          ],
          nextId: state.nextId + 1,
        },
        "Demo request added. The doctor can now confirm it.",
      );
    }
    case "appointment": {
      const appointment = state.appointments.find((a) => a.id === command.id);
      if (actor.role !== "doctor" || appointment?.doctorId !== actor.id)
        return fail("This appointment is not in your doctor workspace.");
      const valid =
        (appointment.status === "Requested" &&
          ["Confirmed", "Declined"].includes(command.status)) ||
        (appointment.status === "Confirmed" && command.status === "Completed");
      if (!valid)
        return fail("That status change is not available in this prototype.");
      return pass(
        {
          appointments: state.appointments.map((a) =>
            a.id === appointment.id ? { ...a, status: command.status } : a,
          ),
        },
        `Demo appointment ${command.status.toLowerCase()}.`,
      );
    }
    case "report": {
      if (actor.role !== "lab")
        return fail("Only the laboratory demo can prepare reports.");
      if (!state.patients.some((p) => p.id === command.patientId))
        return fail("Choose an existing demo patient.");
      if (
        !command.title.trim() ||
        command.title.length > 100 ||
        !command.content.trim() ||
        new TextEncoder().encode(command.content).byteLength > 65536 ||
        !/\.txt$/i.test(command.fileName)
      )
        return fail("Use a title and a nonempty .txt sample of at most 64 KB.");
      return pass(
        {
          reports: [
            {
              id: `REP-${state.nextId}`,
              patientId: command.patientId,
              title: command.title.trim(),
              content: command.content,
              fileName: command.fileName,
              date: "2026-09-28",
              laboratory: "Northside Laboratory",
            },
            ...state.reports,
          ],
          nextId: state.nextId + 1,
        },
        "Demo report is available in the selected patient's workspace.",
      );
    }
    case "article": {
      if (actor.role !== "editor")
        return fail("Use the content-maintainer demo to edit articles.");
      const a = command.article;
      if (
        !a.title.trim() ||
        a.title.length > 120 ||
        !a.category.trim() ||
        !a.summary.trim() ||
        a.summary.length > 3000 ||
        !a.symptoms.trim() ||
        !validSource(a.source)
      )
        return fail("Complete the article and use a valid HTTPS source link.");
      const exists = state.articles.some((p) => p.id === a.id);
      const article = {
        ...a,
        id: exists ? a.id : `article-${state.nextId}`,
        title: a.title.trim(),
        edited: true,
      };
      return pass(
        {
          articles: exists
            ? state.articles.map((p) => (p.id === a.id ? article : p))
            : [...state.articles, article],
          nextId: exists ? state.nextId : state.nextId + 1,
        },
        article.published
          ? "Article published inside this demo; edits are marked unreviewed."
          : "Draft saved inside this demo.",
      );
    }
  }
}
