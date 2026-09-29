import {
  createDatabase,
  databaseConfig,
  transaction,
} from "../.backend-build/src/server/database.js";
import { seedFictional } from "../.backend-build/src/server/seed.js";
let pool;
try {
  pool = createDatabase(databaseConfig());
  const [command, email, role, profileId] = process.argv.slice(2);
  if (command === "seed") {
    await seedFictional(pool);
    console.log(
      "Fictional Pakistani directory and sourced library entries are ready.",
    );
  } else if (command === "staff") {
    if (!email || !["doctor", "lab", "editor"].includes(role))
      throw new Error(
        "Usage: staff EMAIL doctor|lab|editor [FICTIONAL_DOCTOR_ID]",
      );
    await transaction(pool, async (client) => {
      const user = (
        await client.query(
          "SELECT id FROM pulse_auth_user WHERE lower(email)=lower($1)",
          [email],
        )
      ).rows[0];
      if (!user)
        throw new Error(
          "The tester must sign in with Google once before receiving a staff role.",
        );
      const member = (
        await client.query(
          "UPDATE pulse.members SET role=$2 WHERE id=$1 RETURNING id",
          [user.id, role],
        )
      ).rows[0];
      if (!member)
        throw new Error(
          "The tester must open their workspace once before receiving a staff role.",
        );
      if (profileId) {
        if (role !== "doctor")
          throw new Error(
            "Only a doctor can be linked to a fictional provider profile.",
          );
        const updated = await client.query(
          "UPDATE pulse.doctors SET owner_id=$2 WHERE id=$1 AND fictional=true AND (owner_id IS NULL OR owner_id=$2)",
          [profileId, user.id],
        );
        if (!updated.rowCount)
          throw new Error(
            "That fictional doctor is missing or already belongs to another account.",
          );
      }
      await client.query('DELETE FROM pulse_auth_session WHERE "userId"=$1', [
        user.id,
      ]);
    });
    console.log(
      "Staff role saved. The tester must sign in again. No invitation was sent.",
    );
  } else throw new Error("Choose seed or staff EMAIL ROLE [DOCTOR_ID].");
} catch (error) {
  console.error(
    error instanceof Error && !("code" in error)
      ? error.message
      : "The management command failed. Check database configuration and inputs.",
  );
  process.exitCode = 1;
} finally {
  await pool?.end();
}
