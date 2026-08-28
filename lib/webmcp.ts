export type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
};

export const toolText = (value: unknown, isError = false): ToolResult => ({
  content: [{ type: "text", text: JSON.stringify(value) }],
  ...(isError ? { isError: true } : {}),
});

export function safeToolError(error: unknown) {
  return toolText(
    { error: error instanceof Error ? error.message : "Unexpected tool error" },
    true
  );
}

export function isWebMcpAvailable(doc: Document = document) {
  return typeof doc.modelContext?.registerTool === "function";
}
