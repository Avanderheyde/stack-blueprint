// @vitest-environment jsdom

import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResearchDesk } from "@/components/research-desk";

const registry = new Map<string, WebMCP.ModelContextTool>();
let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;

const envelope = (payload: unknown) => new Response(JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  result: { content: [{ type: "text", text: JSON.stringify(payload) }] },
}), { status: 200, headers: { "content-type": "application/json" } });

beforeEach(() => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  registry.clear();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  Object.defineProperty(document, "modelContext", {
    configurable: true,
    value: {
      registerTool: vi.fn(async (tool: WebMCP.ModelContextTool) => void registry.set(tool.name, tool)),
    },
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  });
  vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body)) as { params: { name: string; arguments: Record<string, unknown> } };
    if (body.params.name === "tool_taxonomy") return envelope({
      taxonomy_version: "2.4-test",
      tool_types: ["extension", "mcp_server", "utility", "dev_toolchain", "library_framework", "evaluation_dataset"].map((value) => ({ value, label: value })),
      topics: ["coding", "design_media", "testing_evaluation"].map((value) => ({ value, label: value })),
      interfaces: ["agent_skill", "mcp"].map((value) => ({ value, label: value })),
      source_availability: [{ value: "open_source", label: "Open source" }],
    });
    if (body.params.name === "search_tools") {
      const query = String(body.params.arguments.query ?? "");
      const tools = query.includes("Expo official MCP")
        ? [{ id: "expo-mcp", title: "Expo MCP Server", tool_type: "mcp_server", interfaces: ["mcp"], maintained: true, url: "https://example.com/expo-mcp" }]
        : query.includes("Supabase official MCP")
          ? [{ id: "supabase-mcp", title: "Supabase MCP", tool_type: "mcp_server", interfaces: ["mcp"], maintained: true, url: "https://example.com/supabase-mcp" }]
          : [{ id: "callstack", title: "Callstack React Native Skills", tool_type: "extension", interfaces: ["agent_skill"], topics: ["coding"], maintained: true, url: "https://example.com/callstack", why: "React Native production skills." }];
      return envelope({ tools, query, limit: 6 });
    }
    if (body.params.name === "search_intel") return envelope({
      query: body.params.arguments.query,
      limit: 8,
      items: [{ id: "harness", title: "Harness design for coding agents", why: "Use a fresh evaluator during software development.", relevance: 0.8, intel_page: "https://example.com/harness" }],
    });
    throw new Error(`Unexpected tool ${body.params.name}`);
  }));
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false;
});

const run = async (name: string, input: Record<string, unknown>) => {
  const tool = registry.get(name);
  if (!tool) throw new Error(`${name} was not registered`);
  const result = await tool.execute(input, { signal: new AbortController().signal }) as { content: Array<{ type: string; text?: string }> };
  return JSON.parse(result.content[0]?.type === "text" ? result.content[0].text ?? "{}" : "{}") as Record<string, any>;
};

describe("live WebMCP page contract", () => {
  it("registers seven tools and shares build, inspect, and constraint state with the page", async () => {
    await act(async () => root.render(<ResearchDesk />));
    expect([...registry.keys()]).toEqual([
      "build_project_blueprint",
      "inspect_project_blueprint",
      "apply_project_constraint",
      "refine_project_blueprint",
      "survey_stack_tools",
      "consult_stack_intel",
      "render_project_blueprint",
    ]);

    let built: Record<string, any> = {};
    await act(async () => {
      built = await run("build_project_blueprint", { project: "A silly mobile app where roommates photograph the fridge and claim food" });
    });
    expect(built.built).toBe(true);
    expect(built.catalogVerifiedPicks).toBeGreaterThanOrEqual(2);
    expect(container.textContent).toContain("CATALOG VERIFIED");

    let inspected: Record<string, any> = {};
    await act(async () => { inspected = await run("inspect_project_blueprint", { pickName: "Expo" }); });
    expect(inspected.pick.name).toBe("Expo");
    expect(document.body.textContent).toContain("WHY THIS PICK");

    let revised: Record<string, any> = {};
    await act(async () => {
      revised = await run("apply_project_constraint", { constraint: "Keep Expo, but optimize this for an offline-first prototype.", preservePicks: ["Expo"] });
    });
    expect(revised.revision).toEqual(expect.objectContaining({
      id: "REV 02",
      preserved: ["Expo"],
      added: expect.arrayContaining(["Expo SQLite", "NetInfo", "expo-examples"]),
    }));
    expect(container.textContent).toContain("REV 02");
  });
});
