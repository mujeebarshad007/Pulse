# Pulse frontend architecture

Updated 2026-09-29. Next.js App Router, React, TypeScript and existing CSS/Tailwind retain the glass design. No Redux, GSAP, shadcn/ui or separate frontend framework was added.

Thin route files compose feature screens. The shared provider loads an authorized server snapshot, exposes async mutation commands, handles notices/loading and refreshes every 15 seconds while visible. It never stores report bytes in browser storage. Connected mode is default; explicit `APP_MODE=demo` preserves the original prototype.

GoogleEntry uses the Better Auth client and explains missing OAuth setup. Gate is presentation only: server routes independently authenticate and authorize. Connected navigation has no persona selector. Patient/doctor/editor forms await writes when the next UI step depends on success. Workspace forms are disabled during command submission.

PrivateUpload sends a bounded PDF after exact-reference lookup and recipient review. Reports download through an authenticated endpoint. Calendar labels derive actual dates; Asia/Karachi times and PKR sample fees remain explicit.

The interface is responsive web, not a native mobile app. The browser tool blocked local validation, so keyboard/narrow-screen/live OAuth acceptance remains pending. Read [the connected file guide](../connected-app-guide.md) and [current validation](../tester-mvp.md).


## Implementation update — 2026-10-03

The new landing.tsx and next-ui.css implement the refreshed cream/sage glass design with CSS motion and reduced-motion/transparency fallbacks. The assistant page holds conversation state in memory, labels quick guides separately, and sends consented questions to /api/assistant. No Redux or animation dependency was added.

This update supersedes conflicting earlier tester-deployment descriptions, without approving unresolved real-patient production policies. Validation and limits: [release evidence](../release-readiness.md).
