# Appointment-first homepage and typography

> Historical design experiment: reverted at the owner’s request on 2026-10-09. The original glass homepage and workspace styling are active. The experiment CSS files remain unimported for reference.

2026-10-09. The owner requested a quieter, more minimal health/appointment hero, continuing the Gemini and typography update.

## Design decisions

The hero leads with **Your next visit. A little simpler.** Doctor/specialty and city search are directly below the introduction, followed by specialty links. Search uses the existing directory filters; no booking behavior changed.

The right panel previews an actual current directory profile, including its supplied name, specialty, city and fee. Its link opens that profile's current times. The preview is explicitly fictional. Empty/loading states link to the directory rather than inventing a doctor, fee or availability. A three-step explanation ends with doctor confirmation, matching the approved request workflow.

The previous large glass orb is replaced by a small animated heart beside the panel heading. Sound/motion controls and reduced-motion support remain. Links below the hero expose appointments, private reports and the health library.

References reviewed: [Superdesign](https://superdesign.dev/) and [Dribbble's health website gallery](https://dribbble.com/search/health-website). The chosen principles are restrained whitespace, clear heading hierarchy and one primary search task. This is original code; no third-party design assets, testimonials, ratings or verification claims were copied.

## Typography

Manrope is self-hosted using `next/font/local`, with its SIL Open Font License included. The source variable font is from [Google Fonts' Manrope directory](https://github.com/google/fonts/tree/main/ofl/manrope). No visitor request to Google Fonts and no font-fetch build dependency are required. A 164,700-byte variable font covers weights 200–800; `display: swap` keeps text visible during loading. Local fallbacks remain.

Headings have deliberate weight/spacing; body text and labels have more readable sizing. Mobile text inputs use 16 px text. The heart remains decorative and conveys no health measurement.

## Learn the files

| File under `web/` | Responsibility |
| --- | --- |
| `src/features/pulse/landing.tsx` | Hero copy, controlled search, directory-driven profile preview and navigation |
| `src/features/pulse/appointment-hero.css` | Two-column layout, compact provider card and mobile stacking |
| `src/features/pulse/typography.css` | Shared font scale, weight, line height and mobile field sizing |
| `src/fonts/Manrope-Variable.ttf`, `src/fonts/OFL.txt` | Self-hosted font and required license |
| `src/app/layout.tsx` | Font loading, CSS variable and shared styles |
| `src/features/pulse/heart-visual.tsx`, `motion.css` | Reused illustration, animation and accessibility overrides |

Learning exercise: search for a specialty and city, then follow the generated URL into directory filtering. Compare this client-side navigation with an authenticated appointment write. Explain why a profile preview cannot promise a slot is still available.

```bash
npm run check:all
git diff --check
npm run package:netlify
```

Gemini is implemented separately: [setup and privacy](gemini-setup.md). Moving from fictional testing to real accounts/providers requires [the real-user onboarding plan](real-user-onboarding.md). A visual redesign does not complete those operational or product decisions.

Validation: 63 tests, lint and production build passed. Browser checks covered loaded Manrope, keyboard search/profile links, Google Gemini consent, and 320/390 px overflow. Full device visual acceptance and live provider/account checks remain pending.


## Shared frontend redesign — 2026-10-09

The current appearance is navy/cobalt/white with lime navigation accents, shared component styling and responsive workspace navigation. This supersedes earlier cream/sage/glass appearance descriptions. See [frontend redesign, file guide, validation and limitations](frontend-redesign.md). No product or production policy changed.
