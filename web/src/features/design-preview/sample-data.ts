/** Fictional design fixtures. Never import into a production data adapter. */
export const designDirections = [
  {
    id: "glass",
    name: "01 / Air",
    subtitle: "Light glass",
    description: "Soft daylight. Frosted navigation. Quiet, confident details.",
    note: "Recommended · a bright, approachable patient experience",
  },
  {
    id: "midnight",
    name: "02 / Nocturne",
    subtitle: "Dark glass",
    description: "Deep ink. Luminous accents. A focused, expressive workspace.",
    note: "A more expressive direction · contrast stays deliberate",
  },
  {
    id: "clarity",
    name: "03 / Studio",
    subtitle: "Crisp & minimal",
    description:
      "Pure white. Sharp hierarchy. A precise, content-first interface.",
    note: "A restrained direction · minimal visual effects",
  },
] as const;
export type Direction = (typeof designDirections)[number]["id"];
export const sampleDoctors = [
  {
    id: "d1",
    name: "Dr. Maya Chen",
    initials: "MC",
    specialty: "General medicine",
    experience: "12 years of experience",
    location: "Northside Clinic",
    color: "peach",
    qualification: "MBBS · General medicine",
    availability: "Sample availability · Monday, 10:30 AM",
  },
  {
    id: "d2",
    name: "Dr. Adam Noor",
    initials: "AN",
    specialty: "Dermatology",
    experience: "8 years of experience",
    location: "Riverside Clinic",
    color: "blue",
    qualification: "MBBS · Dermatology",
    availability: "Sample availability · Tuesday, 2:00 PM",
  },
  {
    id: "d3",
    name: "Dr. Sara Ellis",
    initials: "SE",
    specialty: "Cardiology",
    experience: "15 years of experience",
    location: "Park Medical Centre",
    color: "lilac",
    qualification: "MBBS · Cardiology",
    availability: "Sample availability · Wednesday, 11:00 AM",
  },
] as const;
export const sampleReports = [
  {
    id: "r1",
    title: "Complete blood count",
    date: "September 24, 2026",
    laboratory: "Northside Laboratory",
  },
  {
    id: "r2",
    title: "Lipid profile",
    date: "September 18, 2026",
    laboratory: "Northside Laboratory",
  },
] as const;
