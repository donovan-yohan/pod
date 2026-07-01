// Step 5 reference (finale) — the agent prompts itself.
//
// Everything so far waits for a human turn. /loop closes the loop: it arms a goal
// (a shell command that should exit 0). After each turn, a turn_end handler runs the
// check; if it still fails and we are under a hard iteration cap, it injects the
// agent's own next prompt with pi.sendUserMessage — so the agent keeps working
// toward the goal with no human in the seat. The cap and /stop are the brakes, and
// the brakes are the point: this is a proof of concept of a looping agent, not a
// production autonomer.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const MAX_ITERATIONS = 5;

export default function (pi: ExtensionAPI) {
  let armed = false;
  let goalCommand = "";
  let iterations = 0;

  function disarm(): void {
    armed = false;
    goalCommand = "";
    iterations = 0;
  }

  pi.registerCommand("loop", {
    description: `Keep working until <shell-command> exits 0 (hard cap: ${MAX_ITERATIONS} iterations).`,
    handler: async (args, ctx) => {
      const command = (args ?? "").trim();
      if (!command) {
        if (ctx.hasUI) ctx.ui.notify("Usage: /loop <shell-command that should exit 0>", "warning");
        return;
      }
      armed = true;
      goalCommand = command;
      iterations = 0;
      if (ctx.hasUI) ctx.ui.setStatus("loop", `looping -> ${command}`);
      pi.sendUserMessage(`Goal: make the shell command \`${command}\` exit 0. Start working toward it now.`);
    },
  });

  pi.registerCommand("stop", {
    description: "Disarm the /loop.",
    handler: async (_args, ctx) => {
      disarm();
      if (ctx.hasUI) {
        ctx.ui.setStatus("loop", "");
        ctx.ui.notify("Loop stopped.", "info");
      }
    },
  });

  // After every turn, check the goal. Stop on success or the cap; otherwise
  // inject the next prompt so the agent drives itself.
  pi.on("turn_end", async (_event, ctx) => {
    if (!armed) return;

    const result = await pi.exec("sh", ["-c", goalCommand]);
    if (result.code === 0) {
      disarm();
      if (ctx.hasUI) {
        ctx.ui.setStatus("loop", "");
        ctx.ui.notify(`Goal met: \`${goalCommand}\` exited 0.`, "info");
      }
      return;
    }

    iterations += 1;
    if (iterations >= MAX_ITERATIONS) {
      disarm();
      if (ctx.hasUI) {
        ctx.ui.setStatus("loop", "");
        ctx.ui.notify(`Loop stopped: hit the ${MAX_ITERATIONS}-iteration cap.`, "warning");
      }
      return;
    }

    pi.sendUserMessage(
      `The goal command \`${goalCommand}\` still fails (exit ${result.code}, attempt ${iterations}/${MAX_ITERATIONS}). Keep working toward making it pass.`,
    );
  });
}
