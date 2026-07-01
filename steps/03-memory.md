# Step 3 — memory (durable notes)

**Branch:** `step-3-memory` · **Capability:** facts that outlive a session

> Drafted and validated after steps 1–2. Outline below so the arc is visible.

The to-do list in Step 2 survives `/reload` but lives *inside* one session. Memory
is different: durable facts (decisions, conventions, "we chose X because Y") written
to a file the agent controls, and **loaded back on `session_start` of a fresh
session**. This is the difference between a scratchpad and a notebook.

Likely shape:
- a `remember` tool that appends a one-line fact to `.pi/memory.md`
- a `recall` tool (or a `session_start` handler) that reads it back into context
- keep it a plain human-readable file, not a black box

Mirrors Pi's shipped `handoff.ts` and the `appendEntry` / `session_start` pattern.
