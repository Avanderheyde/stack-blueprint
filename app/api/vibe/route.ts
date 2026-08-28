import { NextRequest } from "next/server";

const UPSTREAM_MCP_URL =
  process.env.VIBELEADERBOARD_MCP_URL ?? "https://www.vibeleaderboard.ai/api/mcp";

const ALLOWED_TOOLS = new Set([
  "search_intel",
  "what_changed",
  "latest_brief",
  "get_intel",
]);

type RpcRequest = {
  jsonrpc?: unknown;
  id?: unknown;
  method?: unknown;
  params?: { name?: unknown; arguments?: unknown };
};

export async function POST(request: NextRequest) {
  let body: RpcRequest;
  try {
    body = await request.json() as RpcRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const toolName = body.params?.name;
  if (
    body.jsonrpc !== "2.0" ||
    body.method !== "tools/call" ||
    typeof toolName !== "string" ||
    !ALLOWED_TOOLS.has(toolName)
  ) {
    return Response.json(
      { error: "Only public, read-only VibeLeaderboard Intel tools are available." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(UPSTREAM_MCP_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "vibe-intel-desk/0.1",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        "content-type": upstream.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return Response.json(
      { error: "The public Intel service is temporarily unavailable." },
      { status: 502 }
    );
  }
}

export function GET() {
  return Response.json(
    {
      service: "Vibe Intel Desk public-data proxy",
      upstream: "VibeLeaderboard MCP",
      tools: [...ALLOWED_TOOLS],
      authentication: "none",
    },
    { headers: { "cache-control": "public, max-age=3600" } }
  );
}
