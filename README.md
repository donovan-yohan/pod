# pod — build a coding agent, one extension at a time

**pod** (a play on **pi + Claude**) is a coding agent you build yourself. You start with a
**bare [Pi](https://github.com/earendil-works/pi) coding agent** — it already has a filesystem
and a terminal, which makes it a chatbot *with hands* — and then you prompt it to **build its own
capabilities**, one Pi extension at a time. The code the agent writes is the agent; that finished
agent is pod.

By the end you have a light proof-of-concept of an agent that can plan, remember, and drive its own next step.

> **Status.** Steps 0–2 are cut as branches and validated live (`gpt-5.5`, one-shot, load clean —
> see [`VALIDATION.md`](./VALIDATION.md)). Steps 3–5 are drafted and land next. This repo also hosts
> the companion **article series** and **live presentation** (migrating in) — progress tracked in
> [Issues](https://github.com/donovan-yohan/pod/issues).

## The arc

| Step | Capability | What you build | Branch |
|------|-----------|----------------|--------|
| 0 | **Hands** | nothing — see that bare Pi can already read, edit, and run | `step-0-bare` |
| 1 | **A new verb** | `hello` — your first custom tool | `step-1-hello` |
| 2 | **Planning** | `todo` — a to-do list the agent uses to track multi-step work | `step-2-todo` |
| 3 | **Memory** | `memory` — durable notes that survive across sessions | `step-3-memory` |
| 4 | **Fan-out** (advanced) | `workflow` — run a scripted multi-step plan | `step-4-workflow` |
| 5 | **Self-prompting** | `loop` — the agent enqueues its own next step until a goal is met | `step-5-loop` |

Each step is **one short prompt** you paste into Pi (see [`PROMPTS.md`](./PROMPTS.md)). The heavy lifting is in [`AGENTS.md`](./AGENTS.md), which teaches Pi how extensions are written — so the prompts stay tiny.

## How to walk it

```bash
npm i -g @earendil-works/pi-coding-agent   # the agent runtime
git checkout step-0-bare                    # start at the beginning
pi                                          # launch the bare agent in this repo
```

Then open [`steps/`](./steps) and follow along. Each landmark is a branch: if a live build goes sideways, `git checkout step-2-todo` shows the finished reference for that step, and you can pick up from there.

- **Per-step guides:** [`steps/00-bare.md`](./steps/00-bare.md) … [`steps/05-loop.md`](./steps/05-loop.md)
- **The prompts:** [`PROMPTS.md`](./PROMPTS.md)
- **How we know it works:** [`VALIDATION.md`](./VALIDATION.md)

## Notes

- **Model:** any Pi-supported model with tool use. This walkthrough is validated against `gpt-5.5-codex`.
- **This is a "fork" in spirit, not a monorepo clone.** It runs on Pi from npm and layers a teachable set of extensions on top. To rebrand it into your own agent, Pi supports it directly — set `piConfig.name`, `configDir`, and `bin` in `package.json` (see Pi's `docs/development.md`, "Forking / Rebranding").
- Extensions here are deliberately small. They are teaching material, not a framework.
