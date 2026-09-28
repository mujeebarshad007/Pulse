# Contributing to PULSE

Start with [the delivery boundary](docs/frontend-delivery.md) and [the learning guide](docs/frontend-learning-guide.md). Follow [AGENTS.md](AGENTS.md) and the [MVP freeze](docs/requirements/MVP-freeze.md).

## Local workflow

1. Define one observable change and its requirement IDs. Resolve production ambiguity first.
2. Create a small branch, explain the intended files and data flow, then implement.
3. Run `npm run check` from the root. For UI changes, verify desktop, narrow screens, keyboard controls, and both successful and unsuccessful journeys.
4. Update the affected documentation, inspect `git diff --check` and `git diff`, and create a focused PR when requested.
5. Review before merging. Passing frontend tests is not production security or medical approval.

Install with `npm run setup`, start with `npm run dev`. Node 22 is the recorded development/CI baseline; exact dependencies are locked in web/package-lock.json. No environment secrets are needed. Do not commit build output, local reports, credentials, or dependency directories.

Use existing controls and feature boundaries. Add a package only if it solves a demonstrated need. Tests should protect outcomes such as record ownership and booking conflicts, not merely duplicate component implementation. Current browser checks are manual; automated browser CI is future work.

No open-source license has been selected by the owner. GitHub-style organization does not itself grant a license.
