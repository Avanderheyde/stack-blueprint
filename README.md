# Stack Blueprint

![Stack Blueprint: Survey. Decide. Lock.](./assets/stack-blueprint-devpost-thumbnail.png)

An open-source WebMCP consultant for the first decision of any software project: **what should we build it with, what AI tools should help us build it, and why?**

A browser agent consults the page’s complete stack taxonomy, VibeLeaderboard’s maintained public tool catalog, and current Intel. It explains alternatives and tradeoffs; the human explicitly locks each decision into an exportable project blueprint.

## Complete decision coverage

The 27-layer blueprint includes:

- **Foundation:** system shape, interface, runtime, data, AI strategy, integrations, engineering workflow, and delivery
- **Product services:** styling/UI, ORM/data layer, identity, storage, search, CMS, transactional email, payments, product analytics, web analytics, monitoring/security, and CI/CD
- **AI building toolkit:** coding agent, builder-model strategy, research/Intel, AI design assistance, repository skills/instructions, MCP and connected tools, and independent review/QA

Every layer presents three approaches with `best for` and `tradeoff` guidance. Any unnecessary layer can be explicitly omitted, so complete coverage does not force unnecessary services into the project.

## WebMCP collaboration

The page registers seven visible tools:

- `begin_project_blueprint` — set the project type, stage, and primary constraint
- `inspect_project_blueprint` — inspect every decision and its tradeoffs
- `survey_stack_tools` — find maintained candidates in the public tool catalog
- `consult_stack_intel` — retrieve current, citable engineering evidence
- `recommend_stack_option` — place a researched recommendation without committing it
- `lock_stack_choice` — lock a decision only after the user approves it
- `render_project_blueprint` — produce the final software and AI build plan

The same educational comparison flow remains usable manually in browsers without WebMCP.

## Why the WebMCP matters

A plain agent answers from model recall and whatever context happens to be in the conversation. Stack Blueprint gives it a structured project profile, a comprehensive decision checklist, curated alternatives, visible user-owned state, current tool survey results, and citable Intel. The result is a better-informed consultation that remains auditable and editable on the page.

## Public evidence boundary

Stack Blueprint uses a narrow same-origin proxy for VibeLeaderboard’s public, read-only catalog and Intel tools. It uses no API key, authentication cookie, Supabase credential, transcript, article body, or private VibeLeaderboard source code. Returned content is treated as untrusted plain text and is never rendered as HTML.

The upstream endpoint can be changed server-side with `VIBELEADERBOARD_MCP_URL`; the default is the public production MCP endpoint. The browser talks only to `/api/vibe`.

## Run and verify

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

The visual and interaction contract is documented in [`DESIGN.md`](./DESIGN.md).

## License

MIT. See [`LICENSE`](./LICENSE).
