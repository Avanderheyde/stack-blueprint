type WebMcpSchema = {
  type: "object";
  properties?: Record<string, unknown>;
  required?: string[];
};

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: WebMcpSchema;
  execute: (input: Record<string, unknown>) => Promise<{
    content: Array<{ type: "text"; text: string }>;
    isError?: boolean;
  }>;
};

interface Document {
  modelContext?: {
    registerTool: (tool: WebMcpTool, options?: { signal?: AbortSignal }) => Promise<void> | void;
  };
}
