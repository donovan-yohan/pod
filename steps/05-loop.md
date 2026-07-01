# Step 5 — the agent prompts itself (`loop`)

**Branch:** `step-5-loop` · **Capability:** a light autonomous loop

## What you build

A `/loop <shell-command>` command that arms a goal (the command should exit 0) and a
`turn_end` handler that, after each turn, checks the goal and — if it still fails and
we are under a hard iteration cap — **injects the agent's own next prompt** with
`pi.sendUserMessage`. Plan (Step 2) + memory (Step 3) + a self-prompt = an agent that
drives itself toward a checkable goal. `/stop` and the cap are the brakes.

## The prompt

> Build a Pi extension at `.pi/extensions/loop.ts` with a `/loop <shell-command>`
> command: it arms a loop whose goal is for that command to exit 0. On each turn_end,
> run the command via pi.exec; if it exits 0, stop and report success; otherwise, if
> under a max-iteration cap (default 5), call pi.sendUserMessage telling the agent the
> goal command still fails and to keep working toward making it pass; when the cap is
> reached, stop. Add a `/stop` command to disarm. The cap is a hard brake so the loop
> cannot run away. Follow AGENTS.md.

## How it works

- **Arm:** `/loop <cmd>` stores the goal command and sends the first `sendUserMessage`
  ("make `<cmd>` exit 0, start now") to kick the agent off.
- **Drive:** on `turn_end`, run `pi.exec("sh", ["-c", cmd])`. Exit 0 → disarm, report
  success. Otherwise increment the counter and `sendUserMessage` the next nudge — that
  injected message *is* the next turn, so the agent keeps going with no human.
- **Brakes (the whole point):** a hard `MAX_ITERATIONS` cap disarms the loop, and `/stop`
  disarms it by hand. A self-prompting loop with no brake is a runaway; the brake is the
  feature, not an afterthought.

## The through-line

This is where the earlier steps pay off: the same `sendUserMessage` that loaded **memory**
in Step 3 now, in a `turn_end` handler with a goal check, becomes a loop. That is the seed
of a real autonomer — a `todo` backlog (Step 2) driven to completion, one self-prompt at a time.

## What good looks like

Reference: `.pi/extensions/loop.ts` on `step-5-loop`. It loads clean and the `/loop`
command arms. The autonomous drive is an **interactive** capability — you run `/loop <cmd>`
in the Pi TUI and watch it push turns until the goal check passes or the cap trips. (A
headless `-p` run invokes the command but does not pump the injected turns, so the loop is
best *shown* live — which is exactly how you would demo it.)

This is a proof of concept of a looping agent, not a production autonomer — the brakes are the point.
