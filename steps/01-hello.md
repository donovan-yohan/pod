# Step 1 — your first tool (`hello`)

**Branch:** `step-1-hello` · **Capability:** a new verb the model can call

## What you build

The smallest useful extension: one custom tool. It proves the whole wiring —
write a `.ts` file in `.pi/extensions/`, `/reload`, and the model has a new verb.

## The prompt

Paste this into a bare Pi session (from [`PROMPTS.md`](../PROMPTS.md)):

> Build a Pi extension at `.pi/extensions/hello.ts` that registers a `hello` tool
> taking a `name` string and returning "Hello, <name>!". Follow the extension
> conventions in AGENTS.md, then tell me how to load and test it.

## How it works

- `export default function (pi) { ... }` is the extension entry point.
- `pi.registerTool({ name, label, description, parameters, execute })` adds the verb.
- `parameters` is a `typebox` schema — that is how the model knows the tool takes a `name`.
- `execute` returns `{ content: [{ type: "text", text }], details }`.

## Load and test

Inside Pi: `/reload`, then ask the agent to "use the hello tool to greet Ada."
Or load the file directly without the project: `pi -e .pi/extensions/hello.ts`.

## What good looks like

The finished reference is `.pi/extensions/hello.ts` on this branch (`step-1-hello`).
If your live build drifts, `git checkout step-1-hello` and compare.

Next: [Step 2 — a to-do list](./02-todo.md).
