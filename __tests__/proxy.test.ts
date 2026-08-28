import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/vibe/route";

afterEach(() => vi.unstubAllGlobals());

const request = (name: string, args: Record<string, unknown>) => new NextRequest("http://localhost/api/vibe", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
});

describe("public Intel proxy", () => {
  it("rejects non-Intel and mutating tools", async () => {
    const response = await POST(request("search_apps", { query: "anything" }));
    expect(response.status).toBe(400);
  });

  it("bounds semantic-search work before reaching upstream", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await POST(request("search_intel", { query: "x".repeat(501), limit: 12 }));
    expect(response.status).toBe(400);
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
});
