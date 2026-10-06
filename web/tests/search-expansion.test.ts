import { test } from "node:test";
import assert from "node:assert/strict";
import { initialState, findDoctors } from "../src/features/pulse/model.ts";
import {
  filterLabTests,
  type LabOffering,
} from "../src/features/pulse/labs-model.ts";
test("doctor fee boundaries intersect with existing search filters", () => {
  const doctors = initialState().doctors,
    one = doctors[0];
  const results = findDoctors(doctors, {
    query: one.name,
    specialty: "",
    city: one.city,
    symptom: "",
    minFee: one.fee,
    maxFee: one.fee,
  });
  assert.deepEqual(
    results.map((d) => d.id),
    [one.id],
  );
  assert.equal(
    findDoctors(doctors, {
      query: one.name,
      specialty: "",
      city: "",
      symptom: "",
      minFee: one.fee + 1,
    }).length,
    0,
  );
});
test("lab filters intersect, trim inputs and exclude drafts", () => {
  const test = {
    id: "a",
    name: "Fictional blood count",
    category: "Sample",
    labName: "Test laboratory",
    city: "Lahore",
    address: "Fictional",
    preparation: "Contact lab",
    fee: 2000,
    published: true,
    active: true,
    owned: false,
  } satisfies LabOffering;
  assert.equal(
    filterLabTests([test, { ...test, id: "b", published: false }], {
      name: " COUNT ",
      category: "sample",
      lab: "test",
      city: "lahore",
    }).length,
    1,
  );
  assert.equal(
    filterLabTests([test], { name: "", category: "", lab: "", city: "Karachi" })
      .length,
    0,
  );
});
