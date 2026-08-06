# Session Workflow (MANDATORY)

Read this file at the start of every work session and follow it strictly. It is the
contract for how work happens on this repository.

## Core rules

1. **Never implement before a plan is agreed.** No code, no installs, no scaffolding
   until the user has reviewed and approved the session plan.
2. **Every day starts the same way.** Before doing anything else, read in order:
   - this file (`AGENTS.md`)
   - `docs/PROJECT_VISION.md`
   - `docs/PRODUCT_REQUIREMENTS.md`
   - `docs/MASTER_PLAN.md` (project source of truth)
   - `docs/DAILY_LOG.md` (never rewrite history — always append)
3. **One commit per logical step.** Split the day's work into small, reviewable commits
   up front and list them in the plan.
4. **The user commits, never the agent.** After each approved step is verified, hand the
   user the exact `git add ...` and `git commit -m "..."` commands. Do NOT run `git add`
   or `git commit` yourself.
5. **Wait for the user.** Do not proceed to the next step until the user has committed
   and confirmed ("okay" / "next").

## Daily workflow

1. **Review** — read this file and the four docs above.
2. **Plan** — propose exactly what will be done this session, split into commits
   (one commit = one step), with scope and verification for each.
3. **Discuss** — present the plan and wait for approval. Adjust based on feedback.
4. **Execute** — one step at a time, in order:
   - implement the step only;
   - verify it (`tsc`, `eslint`, `next build` / server checks as applicable);
   - give the user the `git add` + `git commit -m` command for that step;
   - stop and wait for the user to commit and say to continue.
5. **Close** — after the last step, update docs (MASTER_PLAN progress + DAILY_LOG entry),
   give the user the final commit command, and stop.

## Non-negotiables

- No professional content (name, projects, skills, services, bio, etc.) as literals in
  `client/` — content comes from the API (AC-02).
- New major dependencies require approval before installation (see `docs/MASTER_PLAN.md`
  dependency approval process).
- Verify every step before offering its commit command.
