import { test } from "node:test";
import assert from "node:assert/strict";
import { educationReply } from "../src/features/pulse/condition-education.ts";
test("education uses sourced text only for explicitly named conditions and never infers from symptoms", () => {
  const answer = educationReply("hypertension", "Explain HIGH BLOOD PRESSURE");
  assert.match(answer.message, /not confirmation/);
  assert.equal(
    answer.links[0].href,
    "https://www.nhs.uk/conditions/high-blood-pressure/",
  );
  assert.deepEqual(answer.doctors, []);
  assert.match(
    educationReply("hypertension", "I have a headache").message,
    /Which condition/,
  );
  assert.match(
    educationReply("invented", "I have an invented disease").message,
    /Which condition/,
  );
  assert.match(
    educationReply("eczema", "Explain eczema").message,
    /other causes/,
  );
});
