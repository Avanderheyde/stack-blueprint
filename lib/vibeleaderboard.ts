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
  takeaways?: string[] | null;
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

export type CatalogApp = {
  id: string;
  title: string;
  url?: string | null;
  github_url?: string | null;
  category?: string | null;
  subcategory?: string | null;
  why?: string | null;
  how_to_use?: string | null;
  how_to_install?: string | null;
  maintained?: boolean | null;
  relevance?: number | null;
  tool_type?: ToolType | null;
  tool_subtype?: string | null;
  tool_interfaces?: ToolInterface[];
  primary_domain?: ToolDomain | null;
  tool_capabilities?: ToolCapability[];
  structured_match?: boolean;
};

export const TOOL_TYPES = ["agent_harness", "skill", "model", "model_runtime", "agent_runtime", "agent_framework", "orchestrator", "mcp_server", "library_sdk", "api_service", "ide_editor", "plugin_extension", "benchmark_eval", "dataset", "infrastructure", "utility", "application", "template_starter", "protocol_standard", "other"] as const;
export const TOOL_INTERFACES = ["cli", "mcp", "api", "sdk", "web", "desktop", "mobile", "editor_extension", "browser_extension", "github_app"] as const;
export const TOOL_DOMAINS = ["software_development", "infrastructure_operations", "data_knowledge", "security_identity", "design_creative", "productivity_collaboration", "business_growth", "finance_commerce", "research_education", "media_communication", "consumer_lifestyle", "other"] as const;
export const TOOL_CAPABILITIES = ["write_code", "review_code", "test_software", "debug_software", "deploy_software", "monitor_systems", "automate_workflows", "orchestrate_agents", "run_models", "manage_data", "search_retrieve", "manage_knowledge", "secure_systems", "manage_identity", "design_interfaces", "create_images_video", "create_audio_voice", "write_content", "manage_work", "collaborate_communicate", "analyze_data", "market_sell", "process_payments", "manage_finances", "conduct_research", "learn_teach", "host_compute", "build_integrations"] as const;

export type ToolType = (typeof TOOL_TYPES)[number];
export type ToolInterface = (typeof TOOL_INTERFACES)[number];
export type ToolDomain = (typeof TOOL_DOMAINS)[number];
export type ToolCapability = (typeof TOOL_CAPABILITIES)[number];

export type ToolSearchFilters = {
  tool_type?: ToolType;
  interface?: ToolInterface;
  primary_domain?: ToolDomain;
  capability?: ToolCapability;
};

export type AppSearchResponse = {
  apps: CatalogApp[];
  limit: number;
  query: string;
  has_more?: boolean;
  ranking?: string;
};

export type ToolSearchResponse = {
  tools: CatalogApp[];
  limit: number;
  query: string;
  has_more?: boolean;
  ranking?: string;
  filters?: ToolSearchFilters;
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

const safeUrl = (value: unknown) => {
  const candidate = text(value, 2048);
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
};

export function sanitizeIntelItem(value: unknown): IntelItem {
  const item = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    id: text(item.id, 64) ?? "",
    title: text(item.title, 300) ?? "Untitled Intel item",
    type: text(item.type, 40),
    kind: text(item.kind, 40),
    medium: text(item.medium, 40),
    source_url: safeUrl(item.source_url),
    url: safeUrl(item.url),
    source_author: text(item.source_author, 160),
    domain: text(item.domain, 255),
    published_at: text(item.published_at, 64),
    created_at: text(item.created_at, 64),
    summary: text(item.summary, 1200),
    description: text(item.description, 1200),
    why: text(item.why, 1600),
    takeaways: Array.isArray(item.takeaways) ? item.takeaways.slice(0, 8).map((value) => text(value, 900)).filter((value): value is string => Boolean(value)) : null,
    intel_kind: text(item.intel_kind, 40),
    category: text(item.category, 100),
    relevance: typeof item.relevance === "number" && Number.isFinite(item.relevance) ? item.relevance : null,
    matched_passages: typeof item.matched_passages === "number" && Number.isFinite(item.matched_passages) ? item.matched_passages : null,
    intel_page: safeUrl(item.intel_page),
  };
}

export function sanitizeCatalogApp(value: unknown): CatalogApp {
  const app = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    id: text(app.id, 64) ?? "",
    title: text(app.title, 200) ?? "Untitled tool",
    url: safeUrl(app.url),
    github_url: safeUrl(app.github_url),
    category: text(app.category, 100),
    subcategory: text(app.subcategory, 100),
    why: text(app.why, 1600),
    how_to_use: text(app.how_to_use, 1600),
    how_to_install: text(app.how_to_install, 800),
    maintained: typeof app.maintained === "boolean" ? app.maintained : null,
    relevance: typeof app.relevance === "number" && Number.isFinite(app.relevance) ? app.relevance : null,
    tool_type: includes(TOOL_TYPES, app.tool_type),
    tool_subtype: text(app.tool_subtype, 80),
    tool_interfaces: list(TOOL_INTERFACES, app.tool_interfaces),
    primary_domain: includes(TOOL_DOMAINS, app.primary_domain),
    tool_capabilities: list(TOOL_CAPABILITIES, app.tool_capabilities),
  };
}

function includes<T extends string>(values: readonly T[], value: unknown): T | null {
  return typeof value === "string" && (values as readonly string[]).includes(value) ? value as T : null;
}

function list<T extends string>(values: readonly T[], value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => includes(values, item)).filter((item): item is T => Boolean(item)))];
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

export async function searchApps(query: string, limit = 8) {
  const response = await callVibeTool<AppSearchResponse>("search_apps", { query, limit });
  return { ...response, apps: (response.apps ?? []).map(sanitizeCatalogApp) };
}

export async function searchTools(query: string, filters: ToolSearchFilters = {}, limit = 8) {
  const response = await callVibeTool<ToolSearchResponse>("search_tools", { query, ...filters, limit });
  return {
    ...response,
    tools: (response.tools ?? []).map((value) => ({ ...sanitizeCatalogApp(value), structured_match: true })),
  };
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
