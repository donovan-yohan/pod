# Step 4 — dynamic workflow (scripted fan-out) · advanced

**Branch:** `step-4-workflow` · **Capability:** run a plan, not just a step

## What you build

A `run_workflow` tool that fans a shell command template over a list of items —
running the same action on each — and returns a **compact per-item summary**
instead of the raw output of every run. Some work is too big for one context
("do X to every item in this list"); this keeps the agent's context holding the
answer, not the exhaust.

## The prompt

> Build a Pi extension at `.pi/extensions/workflow.ts` with a `run_workflow` tool
> that takes a list of items and a shell command template containing `{}`, runs the
> command once per item (substituting `{}` with the item) via pi.exec, and returns a
> compact summary of each item's exit code and first line of output — not the raw
> per-item noise. Follow AGENTS.md.

## How it works

- **Fan out with `pi.exec`.** For each item, substitute `{}` into the template and run
  `pi.exec("sh", ["-c", command])`. `pi.exec` returns `{ stdout, stderr, code, killed }`.
- **Summarize, don't dump.** Each item becomes one line — `item: exit <code> — <first line>`.
  The point of a workflow is that the *summary* comes back to the agent, not megabytes of
  per-item output that would blow the context.
- **Respect the abort signal.** `execute`'s third arg is an `AbortSignal`; check it between
  items and pass it to `pi.exec` so a cancelled turn stops the fan-out.

## Why this is the "advanced" step

It is the first tool that does *N* things per call. That is the seed of real agent
workflows — subagents, map-reduce over a repo, batch verification. Keep it a compact
summary in, compact summary out; the moment a tool returns raw bulk, it stops helping.

## What good looks like

Reference: `.pi/extensions/workflow.ts` on `step-4-workflow`. Validated live against
`openai-codex/gpt-5.5` and runtime-tested — `run_workflow(["alpha","beta","gamma"], "echo GOT-{}")`
returns three `exit 0` summary lines.

Next: [Step 5 — the agent prompts itself](./05-loop.md).
