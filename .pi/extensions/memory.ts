// Step 3 reference — durable memory that outlives a session.
//
// Step 2's todo list survives /reload but lives inside one session. Memory is
// different: facts are appended to a plain, human-readable .pi/memory.md that the
// agent owns, and read back on session_start of a *fresh* session. A widget shows
// them to the human; the sendUserMessage loads them into the model's context so
// they actually steer the agent (a widget alone is only cosmetic). That last
// move — injecting a message — is the seed of Step 5's self-prompting loop.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { mkdir, readFile, appendFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const memoryPath = join(process.cwd(), ".pi", "memory.md");

async function readFacts(): Promise<string[]> {
  try {
    const text = await readFile(memoryPath, "utf8");
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("- "))
      .map((line) => line.slice(2).trim())
      .filter(Boolean);
  } catch (error: any) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "remember",
    label: "Remember",
    description: "Append a one-line fact to .pi/memory.md so it can be recalled in future sessions.",
    parameters: Type.Object({
      fact: Type.String({ description: "A concise, one-line fact to remember." }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const fact = oneLine(params.fact);
      if (!fact) {
        return {
          content: [{ type: "text", text: "Nothing to remember: fact was empty." }],
          details: { remembered: false },
        };
      }

      await mkdir(dirname(memoryPath), { recursive: true });
      await appendFile(memoryPath, `- ${fact}\n`, "utf8");

      if (ctx.hasUI) ctx.ui.notify(`Remembered: ${fact}`, "info");

      return {
        content: [{ type: "text", text: `Remembered: ${fact}` }],
        details: { remembered: true, fact, path: memoryPath },
      };
    },
  });

  // On a fresh session, read the notebook back and put it in front of the model.
  pi.on("session_start", async (_event, ctx) => {
    const facts = await readFacts();
    if (facts.length === 0) return;

    const lines = facts.map((fact) => `- ${fact}`);
    if (ctx.hasUI) {
      ctx.ui.setWidget("memory", ["Saved memory:", ...lines]);
      ctx.ui.setStatus("memory", `${facts.length} remembered fact${facts.length === 1 ? "" : "s"}`);
    }

    pi.sendUserMessage(`Saved memory from .pi/memory.md:\n${lines.join("\n")}`);
  });
}
