import { randomUUID } from "node:crypto";
import type { Database } from "../../src/server/database.ts";
import type { Actor } from "../../src/features/pulse/model.ts";
export async function fixtureActor(
  pool: Database,
  role: Actor["role"],
  id: string = randomUUID(),
): Promise<Actor> {
  const name = `Fictional ${role}`;
  await pool.query(
    'INSERT INTO pulse_auth_user(id,name,email,"emailVerified") VALUES($1,$2,$3,true) ON CONFLICT(id) DO NOTHING',
    [id, name, `${id}@example.test`],
  );
  await pool.query(
    "INSERT INTO pulse.members(id,role,display_name) VALUES($1,$2,$3) ON CONFLICT(id) DO NOTHING",
    [id, role, name],
  );
  if (role === "patient")
    await pool.query(
      "INSERT INTO pulse.patients(id,name,email,city) VALUES($1,$2,$3,'Karachi') ON CONFLICT(id) DO NOTHING",
      [id, name, `${id}@example.test`],
    );
  if (role === "doctor") {
    const profile = {
      id,
      name,
      specialty: "General medicine",
      qualifications: "Fictional MBBS",
      experience: 5,
      clinic: "Test clinic",
      city: "Karachi",
      fee: 2000,
      about: "Fictional profile",
      symptoms: ["headache"],
      color: "blue",
    };
    await pool.query(
      "INSERT INTO pulse.doctors(id,owner_id,profile) VALUES($1,$1,$2) ON CONFLICT(id) DO NOTHING",
      [id, profile],
    );
  }
  return { id, name, role };
}
