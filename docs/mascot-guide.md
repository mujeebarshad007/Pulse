# Nova mascot guide

Nova is mounted once from the shared Next.js root layout, so it appears across public pages, account pages and workspaces. Its client component builds the bundled `nova.avatar.json` definition with `createAvatar`. The React package stylesheet is imported once by the root layout.

The definition includes 23 animations: `sleeping`, `waking`, `idle`, `listening`, `thinking`, `searching`, `working`, `excited`, `bored`, `suspicious`, `angry`, `drowsy`, `happy`, `curious`, `confused`, `surprised`, `proud`, `shy`, `sad`, `laughing`, `scared`, `playful` and `celebrate`. Normal motion starts `idle`; `prefers-reduced-motion: reduce` selects the still `neutral` expression. The avatar is 120 × 120 px. Desktop uses a fixed bottom-right position; at phone widths it moves to the bottom-right after the page content to avoid covering controls.

Files and data flow:

- `web/src/nova.avatar.json` defines Nova's body, expressions and animations.
- `web/src/components/pulse/nova-mascot.tsx` creates the React avatar and observes the system motion preference.
- `web/src/app/layout.tsx` imports the avatar styles and mounts the component for all routes.
- `web/src/app/globals.css` positions the avatar and changes its placement on narrow screens.

## Validate and learn

From the repository root run:

```bash
npm run check
git diff --check
```

To run the site, use the setup steps in the [README](../README.md), then run `npm run dev` from the repository root and open [http://localhost:3000](http://localhost:3000).

Learning exercise: change the component's `defaultAnimation` from `idle` to `curious`, then set your operating system to reduce motion and confirm the mascot displays `neutral` without animating. On a phone-sized viewport, confirm Nova appears after page content rather than over a button.
