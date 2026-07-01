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

## Step 4 — workflow (scripted fan-out, advanced)

> Build a Pi extension at `.pi/extensions/workflow.ts` with a `run_workflow` tool
> that takes a list of items and a shell command template containing `{}`, runs the
> command once per item (substituting `{}` with the item) via pi.exec, and returns a
> compact summary of each item's exit code and first line of output — not the raw
> per-item noise. Follow AGENTS.md.

## Step 5 — loop (the agent prompts itself)

> Build a Pi extension at `.pi/extensions/loop.ts` with a `/loop <shell-command>`
> command: it arms a loop whose goal is for that command to exit 0. On each turn_end,
> run the command via pi.exec; if it exits 0, stop and report success; otherwise, if
> under a max-iteration cap (default 5), call pi.sendUserMessage telling the agent the
> goal command still fails and to keep working toward making it pass; when the cap is
> reached, stop. Add a `/stop` command to disarm. The cap is a hard brake so the loop
> cannot run away. Follow AGENTS.md.
