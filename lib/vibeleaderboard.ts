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
  interfaces?: ToolInterface[];
  topics?: ToolTopic[];
  source_availability?: ToolSourceAvailability | null;
  structured_match?: boolean;
};

// VibeLeaderboard tool taxonomy V2.4. Type describes the adopted artifact,
// Topic describes why someone adopts it, and Interface describes how it is used.
export const TOOL_TYPES = ["agent", "application", "dev_environment", "utility", "model", "runtime", "dev_toolchain", "library_framework", "service", "mcp_server", "extension", "infrastructure", "evaluation_dataset", "template_starter", "protocol_standard"] as const;
export const TOOL_TOPICS = ["coding", "agents_automation", "models", "data_knowledge", "testing_evaluation", "deployment_operations", "security_identity", "design_media", "work_business", "research_learning"] as const;
export const TOOL_INTERFACES = ["cli", "web", "desktop", "mobile", "editor_extension", "browser_extension", "api", "client_sdk", "mcp", "github_app", "agent_skill", "host_plugin"] as const;
export const TOOL_SOURCE_AVAILABILITY = ["open_source", "source_available", "closed_source", "unknown"] as const;

export type ToolType = (typeof TOOL_TYPES)[number];
export type ToolTopic = (typeof TOOL_TOPICS)[number];
export type ToolInterface = (typeof TOOL_INTERFACES)[number];
export type ToolSourceAvailability = (typeof TOOL_SOURCE_AVAILABILITY)[number];

export type ToolSearchFilters = {
  tool_type?: ToolType;
  interface?: ToolInterface;
  topic?: ToolTopic;
  open_source?: boolean;
};

type TaxonomyOption = { value: string; label: string };

export type ToolTaxonomyResponse = {
  taxonomy_version?: string;
  tool_types: TaxonomyOption[];
  topics: TaxonomyOption[];
  interfaces: TaxonomyOption[];
  source_availability: TaxonomyOption[];
  field_rules?: Record<string, string>;
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
    interfaces: list(TOOL_INTERFACES, app.interfaces),
    topics: list(TOOL_TOPICS, app.topics),
    source_availability: includes(TOOL_SOURCE_AVAILABILITY, app.source_availability),
  };
}

const taxonomyOptions = (value: unknown): TaxonomyOption[] => {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row = entry as Record<string, unknown>;
    const value = text(row.value, 80);
    const label = text(row.label, 120);
    return value && label && /^[a-z][a-z0-9_]*$/.test(value) ? [{ value, label }] : [];
  });
};

export function sanitizeToolTaxonomy(value: unknown): ToolTaxonomyResponse {
  const row = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const rules = row.field_rules && typeof row.field_rules === "object"
    ? Object.fromEntries(Object.entries(row.field_rules as Record<string, unknown>)
      .flatMap(([key, value]) => {
        const safeKey = /^[a-z][a-z0-9_]*$/.test(key) ? key : null;
        const safeValue = text(value, 500);
        return safeKey && safeValue ? [[safeKey, safeValue]] : [];
      }))
    : undefined;
  return {
    taxonomy_version: text(row.taxonomy_version, 80) ?? undefined,
    tool_types: taxonomyOptions(row.tool_types),
    topics: taxonomyOptions(row.topics),
    interfaces: taxonomyOptions(row.interfaces),
    source_availability: taxonomyOptions(row.source_availability),
    ...(rules ? { field_rules: rules } : {}),
  };
}

export function filtersSupportedByTaxonomy(filters: ToolSearchFilters, taxonomy: ToolTaxonomyResponse | null): ToolSearchFilters {
  if (!taxonomy) return filters;
  const has = (items: TaxonomyOption[], value: string | undefined) => !value || items.some((item) => item.value === value);
  return {
    ...(has(taxonomy.tool_types, filters.tool_type) ? { tool_type: filters.tool_type } : {}),
    ...(has(taxonomy.interfaces, filters.interface) ? { interface: filters.interface } : {}),
    ...(has(taxonomy.topics, filters.topic) ? { topic: filters.topic } : {}),
    ...(filters.open_source === true && taxonomy.source_availability.some((item) => item.value === "open_source") ? { open_source: true } : {}),
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

export async function getToolTaxonomy() {
  return sanitizeToolTaxonomy(await callVibeTool<unknown>("tool_taxonomy"));
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
