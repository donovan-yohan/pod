# Step 3 — memory (durable notes)

**Branch:** `step-3-memory` · **Capability:** facts that outlive a session

## What you build

A `remember` tool that appends a one-line fact to a plain `.pi/memory.md` file the
agent owns, and a `session_start` handler that reads the file back into the *next*
session. The to-do list in Step 2 survives `/reload` but lives inside one session.
Memory is different: it is the difference between a scratchpad and a notebook.

## The prompt

> Build a Pi extension at `.pi/extensions/memory.ts` with a `remember` tool that
> appends a one-line fact to a human-readable `.pi/memory.md` file, and on
> session_start reads that file back and surfaces the saved facts so they persist
> across separate sessions. Follow AGENTS.md.

## How it works

- **State lives in a file, not the session.** `remember` does `appendFile(".pi/memory.md", "- <fact>\n")`.
  A plain human-readable file — you can open and edit it yourself, no black box.
- **Read it back on a fresh session:** the `session_start` handler reads `.pi/memory.md`
  (returning `[]` on `ENOENT`, so an empty notebook is fine) and:
  - shows the facts in a widget (`ctx.ui.setWidget`) — for the human, and
  - calls `pi.sendUserMessage(...)` with the facts — so they enter the **model's context**.
- **Why `sendUserMessage`:** a widget is cosmetic; it does not put anything in front of
  the model. To make memory actually *steer* the agent, the facts have to re-enter the
  conversation. That same primitive — injecting a message — is what Step 5 puts in a loop.

## Contrast with Step 2

| | Step 2 `todo` | Step 3 `memory` |
|---|---|---|
| Lives in | the session branch (`details` + `getBranch`) | a file on disk (`.pi/memory.md`) |
| Survives `/reload` | yes | yes |
| Survives a **new session** | no | **yes** |

## What good looks like

Reference: `.pi/extensions/memory.ts` on `step-3-memory`. Validated live against
`openai-codex/gpt-5.5` — the `remember` tool writes to `.pi/memory.md`, and the file
is loaded back on the next session.

Next: [Step 4 — dynamic workflow](./04-dynamic-workflow.md).
