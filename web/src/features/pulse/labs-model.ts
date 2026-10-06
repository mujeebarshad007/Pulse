export type LabOffering = {
  id: string;
  name: string;
  category: string;
  labName: string;
  city: string;
  address: string;
  preparation: string;
  fee: number;
  published: boolean;
  active: boolean;
  owned: boolean;
};
export type LabSlot = {
  id: string;
  testId: string;
  start: string;
  end: string;
};
export type LabBooking = {
  id: string;
  testId: string;
  patientId: string;
  patientName: string;
  name: string;
  labName: string;
  address: string;
  start: string;
  end: string;
  price: number;
  status: string;
  reason: string;
  reports: { id: string; title: string }[];
};
export type LabData = {
  offerings: LabOffering[];
  slots: LabSlot[];
  bookings: LabBooking[];
};
export const emptyLabs: LabData = { offerings: [], slots: [], bookings: [] };
export function filterLabTests(
  tests: LabOffering[],
  filters: { name: string; category: string; lab: string; city: string },
) {
  const includes = (value: string, query: string) =>
    value.toLowerCase().includes(query.trim().toLowerCase());
  return tests.filter(
    (t) =>
      t.published &&
      includes(t.name, filters.name) &&
      includes(t.category, filters.category) &&
      includes(t.labName, filters.lab) &&
      includes(t.city, filters.city),
  );
}
export function labDate(value: string) {
  return (
    new Intl.DateTimeFormat("en-PK", {
      timeZone: "Asia/Karachi",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value)) + " PKT"
  );
}
