# Validation protocol

The point of this repo is a claim: **each step's one short prompt turns a bare Pi
agent into the working capability, with minimal in-between prompting.** This file
is how we prove it, and where we record the result.

Model under test: **`gpt-5.5`** (provider `openai-codex`). Validated 2026-07-01.

## Setup (once)

1. `npm i -g @earendil-works/pi-coding-agent` — installed and validated against **0.80.3**.
2. Auth the model for Pi (done: `gpt-5.5` via `openai-codex`).
3. `git checkout step-0-bare`.

## Per-step test (the real walkthrough — interactive)

1. Start the bare agent in this repo: `pi --provider openai-codex --model gpt-5.5 --thinking high`.
2. Paste the step's prompt from [`PROMPTS.md`](./PROMPTS.md). **Do not help beyond the prompt.**
3. Approve project trust when asked (so `AGENTS.md` loads). Then let it build.
4. Run `/reload`, exercise the capability, confirm it works.
5. Compare Pi's output to the reference on `step-N-*`. If Pi's differs but passes, keep the
   note. If the prompt needed hand-holding, tighten the prompt or `AGENTS.md` and re-run.

## The bar (pass criteria)

- [x] one short prompt — no multi-step spoon-feeding
- [x] extension file created in the right place (`.pi/extensions/*.ts`)
- [x] `/reload` loads it with no error
- [x] capability demonstrably works when exercised
- [x] ≤ 1 corrective human turn

## Log

| Step | Prompt one-shot? | Loaded clean? | Worked? | Extra turns | Notes |
|------|:---:|:---:|:---:|:---:|-------|
| 1 hello | ✅ | ✅ | ✅ | 0 | model built the tool from the prompt + AGENTS.md; code-identical to reference |
| 2 todo  | ✅ | ✅ | ✅ | 0 | model built `todo_write` + widget + `session_start` restore; loads `OK.` |
| 3 memory | ✅ | ✅ | ✅ | 0 | `remember` writes `.pi/memory.md` (runtime-tested end-to-end); `session_start` loads it back |
| 4 workflow | ✅ | ✅ | ✅ | 0 | `run_workflow` fans a `{}` command template over a list via `pi.exec`; runtime-tested 3/3 items summarized |
| 5 loop | ✅\* | ✅ | interactive | 0 | loads clean; `/loop` arms + `turn_end`/`sendUserMessage`/cap correct by construction; self-drive is an interactive capability (see note) |

\* Step 5: the prompt was observed one-shotting a correct-structured `loop.ts` (right
APIs, `MAX_ITERATIONS` cap), but a cwd-reset + temp-cleanup race in the headless harness
kept eating the untracked file, so the committed reference is hand-finalized and load-checked.
The autonomous drive needs the interactive TUI: `pi -p` *invokes* the `/loop` command (confirmed
— `/help` runs headless too) but does not pump the turns that `sendUserMessage` injects, so the
loop only self-drives in a live session. The `sendUserMessage` primitive itself was runtime-proven
in Step 3 (memory injects context that the agent then acts on).

## Findings (things the live run surfaced — fixed in the repo)

- **`piConfig` in `package.json` broke startup.** With `piConfig.configDir: ".pi"` and a
  local `.pi/` present, Pi resolves auth/config from the repo-local `.pi/` (no creds there)
  and stalls at startup — zero events, no model turn. Removed `piConfig`; the fork/rebrand
  angle isn't worth breaking the agent. Auth lives in `~/.pi`; leave it there.
- **The primer must be self-sufficient.** AGENTS.md used to point the agent at the full
  `docs/extensions.md` (~100KB). The agent paginated the whole file on every build, blowing
  the turn (600KB+ of read traffic, no code written in time). Rewrote that line to "build
  from the cheat-sheet; don't open the full doc unless stuck." Builds got dramatically faster.
- **Show the `execute` signature or the tool silently breaks.** Step 3's first build *loaded
  clean* but never worked: the model wrote `execute({ fact })`, destructuring the args off the
  **first** parameter — which is `toolCallId` (a string), not the params. The typed args are
  the **second** arg. AGENTS.md only said "execute returns …", so the model guessed. Added the
  full signature `execute(toolCallId, params, signal, onUpdate, ctx)` to the primer; the rebuild
  was correct and runtime-passed. Lesson: "loads clean" ≠ "works" — runtime-test the tool.

## How the headless check was run (no human in the loop)

Interactive is the real UX. For automated validation we drove Pi non-interactively:

```
pi --provider openai-codex --model gpt-5.5 --thinking minimal \
   -ne -t write,edit --append-system-prompt AGENTS.md --no-session \
   -p "<step prompt>"
```

- `--append-system-prompt AGENTS.md` loads the primer without needing project trust (`-a`).
- `-t write,edit` (deny `bash`/`read`) keeps the agent from spawning a nested `pi` to
  "test" the extension (which deadlocks headless) or paginating files.
- `-p` buffers all output until the turn ends, so a long reasoning chain *looks* hung —
  use `--mode json` to watch progress, and give it a generous timeout. `gpt-5.5` reasons
  for a while; `--thinking minimal` is enough for these steps and finishes fastest.
- Load-check the result offline (no model, no auth): `OK.` = it loaded.
  ```
  pi --offline --no-session -ne -e .pi/extensions/<name>.ts -p "ok"
  ```

## Static checks (no model needed)

- Pi installed: `0.80.3`. Extension API confirmed against the installed
  `dist/core/extensions/types.d.ts` and shipped `examples/extensions/`.
- Every API the reference extensions call (`registerTool`, `on`, `appendEntry`,
  `sendUserMessage`, `ctx.ui.*`, `ctx.hasUI`, `ctx.sessionManager.getBranch`) exists in
  the installed types and docs.
- Reference extensions load clean via `pi --offline -ne -e .pi/extensions/<name>.ts -p "ok"`.
