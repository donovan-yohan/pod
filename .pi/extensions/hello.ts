// Step 1 reference — the smallest useful extension: one custom tool.
//
// Proves the whole wiring: a .ts file in .pi/extensions/, `/reload`, and the
// model has a new verb it can call.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "hello",
    label: "Hello",
    description: "Greet someone by name. A placeholder capability that proves the wiring.",
    parameters: Type.Object({
      name: Type.String({ description: "Who to greet" }),
    }),
    async execute(_toolCallId, params) {
      return {
        content: [{ type: "text", text: `Hello, ${params.name}!` }],
        details: {},
      };
    },
  });
}
