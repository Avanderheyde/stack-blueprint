export type IntelItem = {
  id: string;
  title: string;
  type?: string | null;
  kind?: string | null;
  medium?: string | null;
  source_url?: string | null;
  url?: string | null;
  source_author?: string | null;
  domain?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  summary?: string | null;
  description?: string | null;
  why?: string | null;
  intel_kind?: string | null;
  category?: string | null;
  takeaways?: unknown;
  key_quotes?: Array<{ quote: string; speaker?: string | null }> | null;
  relevance?: number | null;
  matched_passages?: number | null;
  intel_page?: string | null;
};

export type IntelSearchResponse = {
  items: IntelItem[];
  limit: number;
  query: string;
  has_more?: boolean;
  ranking?: string;
};

export type ChangedResponse = {
  items?: IntelItem[];
  changes?: IntelItem[];
  since?: string;
  count?: number;
};

type McpEnvelope = {
  result?: {
    content?: Array<{ type: string; text?: string }>;
    isError?: boolean;
  };
  error?: { message?: string };
};

export const PUBLIC_MCP_URL = "/api/vibe";

let requestId = 0;

export async function callVibeTool<T>(name: string, args: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(PUBLIC_MCP_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: ++requestId,
      method: "tools/call",
      params: { name, arguments: args },
    }),
  });

  if (!response.ok) throw new Error(`VibeLeaderboard returned HTTP ${response.status}.`);

  const envelope = (await response.json()) as McpEnvelope;
  if (envelope.error) throw new Error(envelope.error.message ?? "The MCP request failed.");

  const text = envelope.result?.content?.find((part) => part.type === "text")?.text;
  if (!text) throw new Error("The MCP response did not contain text content.");

  const payload = JSON.parse(text) as T & { error?: string };
  if (envelope.result?.isError || payload.error) {
    throw new Error(payload.error ?? "The VibeLeaderboard tool returned an error.");
  }
  return payload;
}

export async function searchIntel(query: string, limit = 8) {
  return callVibeTool<IntelSearchResponse>("search_intel", { query, limit });
}

export async function getRecentIntel(since?: string, limit = 12) {
  return callVibeTool<ChangedResponse>("what_changed", { ...(since ? { since } : {}), limit });
}

export async function getIntel(id: string) {
  const response = await callVibeTool<{ item?: IntelItem; intel?: IntelItem } & IntelItem>("get_intel", { id });
  return response.item ?? response.intel ?? response;
}

export function changedItems(response: ChangedResponse) {
  return response.items ?? response.changes ?? [];
}
