# Step 2 — a to-do list the agent can use (`todo`)

**Branch:** `step-2-todo` · **Capability:** planning that survives reloads

## What you build

A `todo_write` tool so the agent plans multi-step work on paper instead of
holding the plan in its head. The model rewrites the whole list each call; the
list shows in a widget and is restored on `session_start`, so it survives
`/reload` and session branches.

## The prompt

> Build a Pi extension at `.pi/extensions/todo.ts` with a `todo_write` tool that
> replaces a to-do list of {task, status} items, shows the list in a widget, and
> restores it on session_start so it survives /reload. Follow AGENTS.md.

## How it works

- **State lives in the tool result `details`.** Each `todo_write` returns
  `details: { todos }`. That is the durable record.
- **Restore on load:** on `session_start`, walk `ctx.sessionManager.getBranch()`,
  find the latest `todo_write` tool result, and rebuild the list from its `details`.
  This is why the plan survives `/reload` and follows session branches correctly.
- **Show it:** `ctx.ui.setWidget("todo", lines)` renders the list above the editor
  (guarded by `if (ctx.hasUI)`).

## Why "replace the whole list" instead of add/remove

Models are reliable at emitting a full desired state and unreliable at surgical
edits to a list they cannot see. Rewriting the whole list each call keeps the
tool dead simple and the state unambiguous.

## What good looks like

Reference: `.pi/extensions/todo.ts` on `step-2-todo`.

Next: [Step 3 — memory](./03-memory.md).
