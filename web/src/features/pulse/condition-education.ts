/** Short educational summaries, not a diagnostic knowledge base. Sources checked 2026-10-06. */
export const conditionEducation = [
  {
    id: "hypertension",
    title: "High blood pressure",
    aliases: ["hypertension", "high blood pressure"],
    summary:
      "High blood pressure often has no noticeable symptoms. Symptoms alone cannot establish whether someone has it. A qualified clinician can explain an existing diagnosis and appropriate follow-up.",
    source: "https://www.nhs.uk/conditions/high-blood-pressure/",
  },
  {
    id: "eczema",
    title: "Atopic eczema",
    aliases: ["atopic eczema", "atopic dermatitis", "eczema"],
    summary:
      "Atopic eczema is a skin condition that can cause itching and dry or cracked skin. Its appearance can vary with skin tone. These features can have other causes, so this description cannot identify a person's condition.",
    source: "https://www.nhs.uk/conditions/atopic-eczema/",
  },
] as const;

export function educationReply(id: string | null, question: string) {
  const lower = question.toLowerCase();
  const entry = conditionEducation.find(
    (item) =>
      item.id === id &&
      item.aliases.some((alias) =>
        new RegExp(`\\b${alias}\\b`, "i").test(lower),
      ),
  );
  return {
    message: entry
      ? `${entry.title}: ${entry.summary} This is general education, not confirmation that you have this condition. Discuss personal symptoms, treatment and tests with a qualified clinician.`
      : "Which condition would you like to understand? Use its name rather than personal records or identifying information. Currently I have sourced introductions to high blood pressure and atopic eczema. For other conditions, use the health library or speak with a qualified clinician; I won't guess a diagnosis from symptoms.",
    doctors: [],
    links: [
      ...(entry
        ? [{ label: `Source: NHS — ${entry.title}`, href: entry.source }]
        : [{ label: "Health library", href: "/library" }]),
      { label: "Choose a clinician in the directory", href: "/doctors" },
    ],
  };
}
