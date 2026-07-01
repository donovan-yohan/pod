# Step 0 — the bare agent already has hands

**Branch:** `step-0-bare`

Before you build anything, see what a bare Pi agent can already do. This is the
whole reason a coding agent beats a chatbot: it is not smarter, it has **hands**.

Two of those hands are built in and need no extension:

- **Filesystem** — it can read, write, and edit files in the repo.
- **Terminal** — it can run shell commands and read their output.

## Try it

```bash
git checkout step-0-bare
pi
```

Then ask it to do something that needs the repo, not just the chat box:

> Read package.json, then create `src/hi.js` that prints the value of the
> "name" field, and run it.

Watch the loop: it *reads* the file, *writes* a new one, *runs* `node src/hi.js`,
and *reads* the output. A chatbot can describe that patch; the agent performs it
against real files and checks the result.

## The point

Everything after this step is just giving the agent **more hands** — a planner, a
memory, a way to fan out, a way to drive itself — by writing small extensions.
Nothing here is magic. It is a loop plus tools.

Next: [Step 1 — your first tool](./01-hello.md).
