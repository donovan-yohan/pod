# The prompts

Paste these into a bare Pi session, one per step. The conventions in
[`AGENTS.md`](./AGENTS.md) do the heavy lifting, so each prompt is short and you
should not need much follow-up. If Pi drifts, the fix is usually one line
("read AGENTS.md first", or "use typebox for the parameters").

---

## Step 1 — hello (your first tool)

> Build a Pi extension at `.pi/extensions/hello.ts` that registers a `hello`
> tool taking a `name` string and returning "Hello, <name>!". Follow the
> extension conventions in AGENTS.md, then tell me how to load and test it.

## Step 2 — todo (a to-do list the agent can use)

> Build a Pi extension at `.pi/extensions/todo.ts` with a `todo_write` tool that
> replaces a to-do list of {task, status} items, shows the list in a widget, and
> restores it on session_start so it survives /reload. Follow AGENTS.md.

## Step 3 — memory (durable notes)

> Build a Pi extension at `.pi/extensions/memory.ts` with a `remember` tool that
> appends a one-line fact to a human-readable `.pi/memory.md` file, and on
> session_start reads that file back and surfaces the saved facts so they persist
> across separate sessions. Follow AGENTS.md.

## Step 4 — workflow (scripted fan-out, advanced)  · pending

> _(drafted after step 3)_

## Step 5 — loop (the agent prompts itself)  · pending

> _(drafted after step 4)_
