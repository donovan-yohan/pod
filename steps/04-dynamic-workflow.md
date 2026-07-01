# Step 4 — dynamic workflow (scripted fan-out) · advanced

**Branch:** `step-4-workflow` · **Capability:** run a plan, not just a step

> Drafted and validated after step 3. Outline below.

Some work is too big for one context: "check every file in `src/` for X." A
workflow tool lets the agent run a **scripted multi-step plan** — fan out over a
list, do the same thing to each, collect the results — so the main agent's context
holds the answer, not the exhaust of every intermediate step.

Likely shape:
- a `run_workflow` tool that takes a list of items and a per-item action
- executes each (via `pi.exec` or a sub-step), aggregates the results
- returns a compact summary, not the raw per-item noise

Mirrors Pi's shipped `subagent/` example. This is the "advanced" step — optional
for a first pass.
