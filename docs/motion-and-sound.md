# Homepage motion and interface sound

Delivered 2026-10-08. This changes presentation only; account, appointment and clinical rules are unchanged.

## What visitors see

- An original SVG glass heart on the homepage, with a gentle double beat, animated decorative pulse line, expanding rings and floating care cards. This is an illustration, not a health measurement.
- Hover/focus/press feedback on navigation, cards, buttons, specialty chips and booking choices. Native selects retain their platform menus and gain focus feedback; the browser's option popup is not replaced with a custom widget.
- Global **Sound off/on** and **Motion on/off** controls. Sound is off initially. Enabling it plays a quiet preview, then buttons/links and changed radio/checkbox/select choices use an 80 ms synthesized click. No continuous audio, hover sounds, typing sounds or medical alarms.
- Sound and motion preferences persist locally under `pulse-experience`; this stores no account or health data. If storage is unavailable, controls work for the current session. Browser sound restrictions do not block navigation.
- Motion can be stopped; operating-system reduced-motion settings also disable animation and take precedence over the play control. Desktop hover effects are limited to fine pointers. Keyboard controls, visible focus and mobile target sizes remain available.

## File responsibilities

| File | Responsibility |
| --- | --- |
| `web/src/features/pulse/heart-visual.tsx` | Decorative SVG shapes and a unique gradient ID; no images or downloaded assets |
| `web/src/features/pulse/motion.css` | Heart/card keyframes, hover/selection feedback, preferences toolbar and reduced-motion overrides |
| `web/src/features/pulse/experience-controls.tsx` | Browser-only preferences, optional Web Audio tones, native interaction listeners and cleanup |
| `web/src/features/pulse/landing.tsx` | Places the heart in the existing hero composition |
| `web/src/app/layout.tsx` | Loads shared styles and mounts one persistent controls component across routes |

No dependency was added. CSS handles the motion instead of per-frame React updates. Web Audio is created only after an eligible interaction with sound enabled; short-lived audio nodes disconnect when finished. Click sounds indicate interaction, never that a booking succeeded. API responses still determine success.

## Learning exercise

1. Toggle Motion off and inspect the HTML `data-pulse-motion` attribute. Explain how one attribute disables several animations.
2. Follow a radio selection from the native `change` event into `play()`. Explain why typing should not trigger sound and why disabled controls are excluded.
3. Compare a CSS animation with a database update: which one can establish that a slot was reserved?

## Validation

Run from the repository root:

```bash
npm run check
git diff --check
npm run package:netlify
```

`npm run check` passed lint, all 19 frontend/domain tests and the production build. Date/time selection was also checked: the selected slot uses `pulse-choice`, and ArrowRight changes the native radio selection.

Browser checks: desktop heartbeat styling, sound initially off, Enter/Space toggles, paused animation resolving to `none`, preferences surviving reload, 390 px homepage/directory without horizontal overflow, and Karachi search returning two fictional profiles with sound enabled. No browser console warnings/errors were recorded during these checks. Sound was restored to off and motion to on after testing. Physical speaker output, Safari/Firefox and OS reduced-motion emulation were not verified by the browser tool; reduced-motion CSS is implemented but device acceptance remains manual.
