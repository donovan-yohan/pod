# Step 5 — the agent prompts itself (`loop`)

**Branch:** `step-5-loop` · **Capability:** a light autonomous loop

> The finale. Drafted and validated after step 4. Outline below.

Everything so far still waits for a human turn. The loop closes that: after each
turn, if a goal is not yet met, the extension **injects the agent's own next
prompt** with `pi.sendUserMessage(...)`. Plan (Step 2) + memory (Step 3) + a
self-prompt = a coding agent that drives itself through a backlog until a
checkable goal (e.g. a shell command passes) is satisfied.

Likely shape:
- a `/loop <goal>` command that arms the loop
- an `on("turn_end")` handler: if the goal check (a `pi.exec` command) still fails
  and we are under an iteration cap, `pi.sendUserMessage("continue toward: <goal>")`
- **hard brakes:** a max-iteration cap and a stop command, so it cannot run away

Mirrors Pi's shipped `send-user-message.ts` (self-prompting) and `trigger-compact.ts`
(a `turn_end` hook). This is a *proof of concept* of a looping agent, not a
production autonomer — the brakes are the point.
