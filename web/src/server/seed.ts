import "server-only";
import { randomUUID } from "node:crypto";
import { initialState } from "../features/pulse/model.ts";
import { transaction, type Database } from "./database.ts";

export async function seedFictional(pool: Database) {
  const fixture = initialState();
  const names = [
    "Dr. Ayesha Khan (fictional)",
    "Dr. Hamza Ali (fictional)",
    "Dr. Sana Ahmed (fictional)",
    "Dr. Usman Shah (fictional)",
    "Dr. Maryam Noor (fictional)",
  ];
  await transaction(pool, async (client) => {
    for (const [index, source] of fixture.doctors.entries()) {
      const doctor = {
        ...source,
        name: names[index],
        clinic: `Pulse Test Clinic ${index + 1}`,
        about:
          "Fictional Pakistani provider for testing Pulse. This is not a real clinician, verified registration, or healthcare service.",
      };
      await client.query(
        "INSERT INTO pulse.doctors(id,profile) VALUES($1,$2) ON CONFLICT(id) DO NOTHING",
        [doctor.id, doctor],
      );
      // Repeated seeding adds only missing future slots; it never overwrites bookings/profiles.
      for (let day = 1; day <= 7; day++) {
        const date = new Date(Date.now() + day * 86400000)
          .toISOString()
          .slice(0, 10);
        for (const time of ["09:00", "10:00", "14:00"]) {
          const start = new Date(`${date}T${time}:00+05:00`),
            end = new Date(start.getTime() + 1800000);
          await client.query(
            "INSERT INTO pulse.availability(id,doctor_id,starts_at,ends_at) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
            [randomUUID(), doctor.id, start, end],
          );
        }
      }
    }
    for (const article of fixture.articles)
      await client.query(
        "INSERT INTO pulse.articles(id,document) VALUES($1,$2) ON CONFLICT(id) DO NOTHING",
        [article.id, article],
      );
    const localSource = {
      id: "pakistan-nih",
      title: "Pakistan health advisories",
      category: "Pakistan resources",
      summary:
        "Find current public-health notices and source documents on the National Institutes of Health Pakistan website. This directory entry provides a source link and does not summarize individual medical advice.",
      symptoms: "This resource is not a symptom checker or diagnosis service.",
      source: "https://www.nih.org.pk/advisories",
      published: true,
      edited: false,
    };
    await client.query(
      "INSERT INTO pulse.articles(id,document) VALUES($1,$2) ON CONFLICT(id) DO NOTHING",
      [localSource.id, localSource],
    );
  });
}
