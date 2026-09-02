import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/vibe/route";

afterEach(() => vi.unstubAllGlobals());

const request = (name: string, args: Record<string, unknown>) => new NextRequest("http://localhost/api/vibe", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
});

describe("public catalog proxy", () => {
  it("rejects mutating and unapproved tools", async () => {
    const response = await POST(request("create_app", { title: "anything" }));
    expect(response.status).toBe(400);
  });

  it("allows bounded public tool search", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request("search_apps", { query: "agent observability", limit: 6 }));
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("allows canonical structured filters", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request("search_tools", { query: "Expo testing", tool_type: "extension", interface: "agent_skill", topic: "testing_evaluation", open_source: true, limit: 6 }));
    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("rejects invented taxonomy values before reaching upstream", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request("search_tools", { query: "Expo testing", tool_type: "magic_widget", limit: 6 }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("bounds semantic-search work before reaching upstream", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request("search_intel", { query: "x".repeat(501), limit: 12 }));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects oversized bodies even without a content-length header", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const oversized = new NextRequest("http://localhost/api/vibe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "search_intel", arguments: { query: "x".repeat(13_000) } } }),
    });
    oversized.headers.delete("content-length");
    const response = await POST(oversized);
    expect(response.status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("forwards a valid read-only request without credentials", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", {
      status: 200,
      headers: { "content-type": "application/json" },
    }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request("search_intel", { query: "agent evaluation", limit: 8 }));

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://www.vibeleaderboard.ai/api/mcp",
      expect.objectContaining({ method: "POST", cache: "no-store" })
    );
    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.credentials).toBeUndefined();
    expect(options.headers).not.toHaveProperty("authorization");
  });

  it("rate limits repeated requests from one public client", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    let response = new Response();
    for (let index = 0; index < 61; index += 1) {
      const next = request("search_intel", { query: "agent evaluation", limit: 8 });
      next.headers.set("x-forwarded-for", "203.0.113.25");
      response = await POST(next);
    }
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("60");
  });
});
