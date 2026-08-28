import { afterEach, describe, expect, it, vi } from "vitest";
import { callVibeTool } from "@/lib/vibeleaderboard";

afterEach(() => vi.unstubAllGlobals());

describe("public VibeLeaderboard MCP client", () => {
  it("unwraps JSON-RPC text content", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        jsonrpc: "2.0",
        id: 1,
        result: { content: [{ type: "text", text: JSON.stringify({ items: [{ id: "one" }] }) }] },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(callVibeTool("search_intel", { query: "agents" })).resolves.toEqual({ items: [{ id: "one" }] });
    expect(fetchMock).toHaveBeenCalledWith("/api/vibe", expect.objectContaining({ method: "POST" }));
  });

  it("does not send credentials to the public endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ result: { content: [{ type: "text", text: "{}" }] } }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await callVibeTool("what_changed");

    const options = fetchMock.mock.calls[0][1] as RequestInit;
    expect(options.credentials).toBeUndefined();
    expect(options.headers).toEqual({ "content-type": "application/json" });
  });
});
