# WebMCP evaluation plan

The deterministic unit suite covers profile inference, conditional product-to-agent-tool matching, public proxy boundaries, response sanitization, and Intel filtering. Run it with `npm test`.

The following browser evals follow Chrome's WebMCP guidance: test whether an agent selects the right tool, supplies valid arguments, observes the output, and completes the visible user journey.

| User intent | Expected call | Acceptance criteria |
|---|---|---|
| "What should I use to build a roommate fridge app?" | `build_project_blueprint({ project })` | The visible drawing starts; result classifies it as a mobile prototype; includes Expo/React Native/NativeWind plus Expo MCP, exact Expo skills, React/Expo diagnostics, agent-device, and Supabase tooling; excludes payments. |
| "Why did you choose Expo MCP?" after a build | `inspect_project_blueprint({ pickId: "expo-mcp" })` | Returns only the requested node and explains current Expo/EAS/simulator context; visible explanation can be opened from the same node. |
| "Find current alternatives for mobile agent testing" | `survey_stack_tools({ query, limit })` | Returns bounded, sanitized public catalog data and identifies it as untrusted evidence; does not alter the blueprint. |
| "What current evidence should change this workflow?" | `consult_stack_intel({ query, limit })` | Returns public Intel summaries with citations and an untrusted-content boundary; no article bodies or transcripts. |
| "Replace NativeWind with StyleSheet after considering bundle constraints" | `refine_project_blueprint({ reasoning, picks })` | Requires a complete replacement plan, preserves valid source URLs, updates the visible drawing, and records the reason. |
| "Turn this into an implementation sequence" | `render_project_blueprint({ title, summary, buildOrder })` after build | Rejects if no blueprint exists; otherwise stores the concise plan and includes it in the copied build brief. |

## Adversarial cases

- Empty or whitespace project descriptions must return a clear tool error.
- Oversized project, query, pick, and URL fields are bounded before use.
- Unknown proxy tools and mutating VibeLeaderboard methods are rejected.
- Upstream strings are treated as untrusted text and never rendered as HTML.
- Catalog search results must never become automatic recommendations without matching a selected technology or explicit execution gap.
- A prototype must defer production analytics/observability when they do not yet create value.
- A backend-only project must not receive frontend, mobile, or anti-slop UI skills.
- A local-only sensitive project must exclude cloud data and telemetry services.
- Tool descriptions should keep the expected sequence legible: build, optionally inspect/survey/consult, refine, then render.

## Pre-submission browser run

1. Open the deployed URL in ChatGPT's in-app browser.
2. Confirm all six tools are discovered.
3. Run the roommate-fridge build journey above through WebMCP.
4. Confirm the visible page changes and the returned structured result agree.
5. Inspect Expo MCP and Vibe Intel.
6. Run one refinement, then render and copy the implementation brief.
7. Repeat in Chrome 149+ with `#enable-webmcp-testing` if available.
8. Check console logs, keyboard focus, reduced motion, mobile layout, upstream partial failure, and signed-out access.
