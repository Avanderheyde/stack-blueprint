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

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : null;

export function sanitizeIntelItem(value: unknown): IntelItem {
  const item = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    id: text(item.id, 64) ?? "",
    title: text(item.title, 300) ?? "Untitled Intel item",
    type: text(item.type, 40),
    kind: text(item.kind, 40),
    medium: text(item.medium, 40),
    source_url: text(item.source_url, 2048),
    url: text(item.url, 2048),
    source_author: text(item.source_author, 160),
    domain: text(item.domain, 255),
    published_at: text(item.published_at, 64),
    created_at: text(item.created_at, 64),
    summary: text(item.summary, 1200),
    description: text(item.description, 1200),
    why: text(item.why, 1600),
    intel_kind: text(item.intel_kind, 40),
    category: text(item.category, 100),
    relevance: typeof item.relevance === "number" && Number.isFinite(item.relevance) ? item.relevance : null,
    matched_passages: typeof item.matched_passages === "number" && Number.isFinite(item.matched_passages) ? item.matched_passages : null,
    intel_page: text(item.intel_page, 2048),
  };
}

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
  const response = await callVibeTool<IntelSearchResponse>("search_intel", { query, limit });
  return { ...response, items: (response.items ?? []).map(sanitizeIntelItem) };
}

export async function getRecentIntel(since?: string, limit = 12) {
  return callVibeTool<ChangedResponse>("what_changed", { ...(since ? { since } : {}), limit });
}

export async function getIntel(id: string) {
  const response = await callVibeTool<{ item?: IntelItem; intel?: IntelItem } & IntelItem>("get_intel", { id });
  return sanitizeIntelItem(response.item ?? response.intel ?? response);
}

export function changedItems(response: ChangedResponse) {
  return (response.items ?? response.changes ?? []).map(sanitizeIntelItem);
}
