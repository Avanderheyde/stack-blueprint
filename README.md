# Vibe Intel Desk

An open-source WebMCP research workspace backed by the public [VibeLeaderboard Intel](https://www.vibeleaderboard.ai/intel) index.

The page gives a browser agent five visible, auditable tools:

- `search_vibe_intel` — semantic search over public editorial summaries and citations
- `show_recent_vibe_intel` — see what changed recently
- `pin_vibe_evidence` — place a source in the shared evidence ledger
- `remove_vibe_evidence` — correct the ledger
- `draft_cited_vibe_brief` — render a synthesis that can cite only pinned evidence

## Data boundary

This repository contains the complete WebMCP client and a narrow same-origin proxy for four read-only Intel tools. The proxy calls VibeLeaderboard as an external public data service through `https://www.vibeleaderboard.ai/api/mcp`. It uses no API key, authentication cookie, Supabase credential, transcript, or private VibeLeaderboard source code. Returned source material is treated as untrusted plain text and is never rendered as HTML.

The upstream endpoint can be changed server-side with `VIBELEADERBOARD_MCP_URL`; the default is the production public endpoint. The browser talks only to the same-origin `/api/vibe` route.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. In a browser with WebMCP support, the status changes to **Agent connected**. In other browsers, the same public search and evidence workflow remains usable manually.

## Verify

```bash
npm test
npm run typecheck
npm run build
```

## Privacy and copyright posture

The desk shows VibeLeaderboard-authored summaries, editorial context, limited quotations, and links back to the original source. It does not fetch or display article bodies or transcripts. The private VibeLeaderboard application is a pre-existing external service and is not part of this open-source client.

## License

MIT. See [LICENSE](./LICENSE).
