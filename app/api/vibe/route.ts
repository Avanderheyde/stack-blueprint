import { NextRequest } from "next/server";

const UPSTREAM_MCP_URL =
  process.env.VIBELEADERBOARD_MCP_URL ?? "https://www.vibeleaderboard.ai/api/mcp";

const ALLOWED_TOOLS = new Set([
  "search_intel",
  "search_apps",
  "get_app",
  "what_changed",
  "latest_brief",
  "get_intel",
]);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_BODY_BYTES = 12_000;

type RpcRequest = {
  jsonrpc?: unknown;
  id?: unknown;
  method?: unknown;
  params?: { name?: unknown; arguments?: unknown };
};

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Request body is too large." }, { status: 413 });
  }

  let body: RpcRequest;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return Response.json({ error: "Request body is too large." }, { status: 413 });
    }
    body = JSON.parse(rawBody) as RpcRequest;
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

  const rawArgs = body.params?.arguments;
  if (rawArgs != null && (typeof rawArgs !== "object" || Array.isArray(rawArgs))) {
    return Response.json({ error: "Tool arguments must be an object." }, { status: 400 });
  }
  const args = (rawArgs ?? {}) as Record<string, unknown>;
  const limit = Number(args.limit ?? 8);

  if (toolName === "search_intel" || toolName === "search_apps") {
    if (typeof args.query !== "string" || !args.query.trim() || args.query.length > 500) {
      return Response.json({ error: "query must contain 1–500 characters." }, { status: 400 });
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 12) {
      return Response.json({ error: "limit must be an integer from 1–12." }, { status: 400 });
    }
  }


  if (toolName === "get_app" && (typeof args.id !== "string" || !UUID.test(args.id))) {
    return Response.json({ error: "id must be a UUID." }, { status: 400 });
  }

  if (toolName === "what_changed") {
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
      return Response.json({ error: "limit must be an integer from 1–20." }, { status: 400 });
    }
    if (args.since != null && (typeof args.since !== "string" || args.since.length > 64)) {
      return Response.json({ error: "since must be a short ISO 8601 string." }, { status: 400 });
    }
  }

  if (toolName === "get_intel" && (typeof args.id !== "string" || !UUID.test(args.id))) {
    return Response.json({ error: "id must be a UUID." }, { status: 400 });
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
