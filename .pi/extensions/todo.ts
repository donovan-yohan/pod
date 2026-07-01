// Step 2 reference — a to-do list the agent uses to plan multi-step work.
//
// The model rewrites the whole list each call. State lives in the tool result
// `details`, and is restored from the session branch on load, so the plan
// survives `/reload` and follows session branches.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

type Todo = { task: string; status: "pending" | "in_progress" | "done" };

const MARK: Record<Todo["status"], string> = {
  pending: "[ ]",
  in_progress: "[~]",
  done: "[x]",
};

function render(todos: Todo[]): string[] {
  if (todos.length === 0) return ["todo: (empty)"];
  return todos.map((t) => `${MARK[t.status]} ${t.task}`);
}

export default function (pi: ExtensionAPI) {
  let todos: Todo[] = [];

  // Rebuild the list from the latest todo_write result on the current branch.
  pi.on("session_start", async (_event, ctx) => {
    todos = [];
    for (const entry of ctx.sessionManager.getBranch()) {
      if (
        entry.type === "message" &&
        entry.message.role === "toolResult" &&
        entry.message.toolName === "todo_write"
      ) {
        todos = entry.message.details?.todos ?? todos;
      }
    }
    if (ctx.hasUI) ctx.ui.setWidget("todo", render(todos));
  });

  pi.registerTool({
    name: "todo_write",
    label: "Write todos",
    description:
      "Replace the whole to-do list. Pass the full list every time. Use it to plan " +
      "multi-step work and to mark progress as you go.",
    parameters: Type.Object({
      todos: Type.Array(
        Type.Object({
          task: Type.String({ description: "What to do" }),
          status: Type.Union([
            Type.Literal("pending"),
            Type.Literal("in_progress"),
            Type.Literal("done"),
          ]),
        }),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      todos = params.todos as Todo[];
      if (ctx.hasUI) ctx.ui.setWidget("todo", render(todos));
      return {
        content: [{ type: "text", text: render(todos).join("\n") }],
        details: { todos: [...todos] },
      };
    },
  });
}
