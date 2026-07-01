# Building this coding agent, one extension at a time

This repo is a hands-on walkthrough. You start with a bare Pi coding agent — it
already has a filesystem and a terminal — and you prompt it to build its own
capabilities as Pi **extensions**. The code the agent writes is the agent.

## How Pi extensions work — read this before building one

- An extension is a single TypeScript file in `.pi/extensions/*.ts`. **No build step** —
  Pi loads `.ts` directly (via jiti).
- It exports one default factory: `export default function (pi: ExtensionAPI) { ... }`.
- Inside the factory you call:
  - `pi.registerTool({ name, label, description, parameters, execute })` — add a verb the
    model can call. `parameters` is a `typebox` `Type.Object({...})`. `execute` has the
    signature `async execute(toolCallId, params, signal, onUpdate, ctx)` — **the typed args
    arrive as the second arg `params`** (not the first), and `ctx` (fifth) carries
    `ctx.ui` / `ctx.hasUI`. It returns `{ content: [{ type: "text", text }], details }`.
  - `pi.registerCommand(name, { description, handler })` — add a `/slash` command for the human.
  - `pi.on(event, async (event, ctx) => {...})` — react to events (`session_start`, `tool_call`,
    `turn_end`, …). Return `{ block: true, reason }` from a `tool_call` handler to veto a tool.
  - `pi.sendUserMessage(text)` — inject a user turn. This is how an agent prompts *itself*.
  - `pi.appendEntry(type, data)` and restore on `session_start` from
    `ctx.sessionManager.getBranch()` — persist state across `/reload` and session branches.
    For tool state, also return it in the tool result `details` so it survives branching.
  - `ctx.ui.notify(msg, "info" | "warning" | "error")`, `ctx.ui.setWidget(key, lines)`,
    `ctx.ui.setStatus(key, text)` — UI. **Guard UI calls with `if (ctx.hasUI)`.**
  - `pi.exec(cmd, args, options)` — run a shell command from inside a tool.
- Imports:
  ```ts
  import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
  import { Type } from "typebox";
  ```
- After writing or editing an extension, run `/reload` in Pi to hot-load it.
  Test a file directly (outside the project) with `pi -e ./path/to/ext.ts`.

## Rules for this repo

- One capability per extension file. Keep it small and readable — this is teaching material.
- Prefer the smallest thing that works. No npm dependencies unless a step calls for it.
- After building an extension, `/reload` and actually exercise it before claiming done.
- The cheat-sheet above is all you need for these steps. Build from it directly —
  don't open the full `docs/extensions.md` (it's ~100KB) unless you hit an API it
  genuinely doesn't cover.
