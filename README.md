# Stack Blueprint

![Stack Blueprint](./assets/stack-blueprint-devpost-thumbnail.png)

An open-source WebMCP consultant for the first decision of any software project: **what should we build it with, what AI tools should help us build it, and why?**

A builder describes an idea in ordinary language. The WebMCP architect infers the project profile, searches VibeLeaderboard’s maintained public tool catalog for related products and tools, gathers a cited Intel packet, and drafts a specific build system. The calling agent is instructed to reason over that context—not copy it—and can apply an evidence-backed refinement before presenting the answer. The product stack, connected services, and AI build setup draw themselves into one connected logo graph. Click any logo to see its role, rationale, and sources.

## What it selects

The internal consultation covers:

- **Foundation:** system shape, interface, runtime, data, AI strategy, integrations, engineering workflow, and delivery
- **Product services:** styling/UI, ORM/data layer, identity, storage, search, CMS, transactional email, payments, product analytics, web analytics, monitoring/security, and CI/CD
- **AI building toolkit:** coding agent, builder-model strategy, research/Intel, AI design assistance, repository skills/instructions, MCP and connected tools, and independent review/QA

The overview shows only the answer: exact products, frameworks, services, coding harness, builder model, repository skills, CI, research, and verification tools. It omits unnecessary services automatically. Rationale stays behind each logo so the initial result remains easy to scan; it does not present an alternative-choice grid unless a user explicitly asks for one.

## WebMCP collaboration

The page registers six visible tools:

- `build_project_blueprint` — infer the profile, consult both evidence sources, and draft every decision from one project description
- `inspect_project_blueprint` — inspect the complete exact stack or one selected pick
- `refine_project_blueprint` — replace the first draft after the agent reasons over constraints, Intel, and related catalog evidence
- `survey_stack_tools` — find maintained candidates in the public tool catalog
- `consult_stack_intel` — retrieve current, citable engineering evidence
- `render_project_blueprint` — produce the final software and AI build plan

The same automatic build and click-to-explain flow remains usable manually in browsers without WebMCP.

## Why the WebMCP matters

A plain agent answers from model recall and whatever context happens to be in the conversation. Stack Blueprint gives it a structured project profile, a comprehensive decision checklist, related VibeLeaderboard entries, and citable Intel. The initial stack remains a hypothesis: the agent is explicitly told that a similar app is not proof, must assess whether its patterns fit, and should apply a researched refinement when the evidence or project constraints disagree.

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
