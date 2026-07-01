// Step 4 reference (advanced) — run a plan, not just a step.
//
// Some work is too big for one context: "do X to every item in this list." The
// run_workflow tool fans a shell command template over a list via pi.exec, then
// returns a *compact* per-item summary (exit code + first line) instead of dumping
// the raw output of every run into the transcript. The agent's context holds the
// answer, not the exhaust. This is the same instinct as a subagent that pays rent.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

function firstLine(text: unknown): string {
  if (typeof text !== "string") return "";
  return text.split(/\r?\n/).find((line) => line.trim().length > 0)?.trim() ?? "";
}

function exitCode(result: any): number {
  if (typeof result?.exitCode === "number") return result.exitCode;
  if (typeof result?.code === "number") return result.code;
  if (typeof result?.status === "number") return result.status;
  return 0;
}

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "run_workflow",
    label: "Run workflow",
    description:
      "Run a shell command template once per item, replacing every {} with the item, and return a compact per-item summary.",
    parameters: Type.Object({
      items: Type.Array(Type.String(), {
        description: "Items to substitute into the command template.",
      }),
      commandTemplate: Type.String({
        description: "Shell command template. Every {} is replaced with the current item.",
      }),
    }),
    async execute(_toolCallId, params, signal) {
      const rows: string[] = [];

      for (const item of params.items) {
        if (signal.aborted) break;

        const command = params.commandTemplate.replaceAll("{}", item);

        try {
          const result = await pi.exec("sh", ["-c", command], { signal });
          const line = firstLine(result?.stdout) || firstLine(result?.stderr) || "(no output)";
          rows.push(`${item}: exit ${exitCode(result)} — ${line}`);
        } catch (error: any) {
          const code = exitCode(error);
          const line = firstLine(error?.stdout) || firstLine(error?.stderr) || error?.message || "failed";
          rows.push(`${item}: exit ${code} — ${line}`);
        }
      }

      const text = rows.length > 0 ? rows.join("\n") : "No items to run.";

      return {
        content: [{ type: "text", text }],
        details: { count: rows.length },
      };
    },
  });
}
