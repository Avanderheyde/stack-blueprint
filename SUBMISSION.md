# Stack Blueprint submission kit

## Elevator pitch (200 characters maximum)

Describe your software. Stack Blueprint uses WebMCP to draft its stack, equip your coding agent with the right skills, MCPs and checks, then explain every choice as the blueprint draws itself.

## Devpost project story

### Inspiration

AI coding agents are good at naming a familiar framework, database, and host. That answer is rarely enough to make them excellent at building with those choices. A React Native project may need Expo-specific skills, device automation, React diagnostics, and a native-quality design pass. A Supabase project benefits from its MCP and explicit database and RLS guidance. Builders should not have to know this entire ecosystem before they begin.

We built Stack Blueprint to answer the harder question: “How do I fully equip my agent to execute this stack well?”

### What it does

Describe any software idea in ordinary language. Stack Blueprint infers the project shape, stage, and priorities; selects a focused product stack; applies curated technology-to-tool mappings; verifies matching workspace picks against VibeLeaderboard's maintained public index; and converts relevant engineering Intel into project-specific instructions.

The result draws itself as an architectural blueprint. The equipped AI workspace appears first, grouped into harness and model, connected MCPs, diagnostics and QA, project skills, and an execution playbook. The application and delivery layers follow. Click any logo to see its role, why it was chosen, and its official source. The overview stays deliberately simple, while the browser agent can inspect, refine, and render the same structured plan through WebMCP.

### Why WebMCP

This is shared work, not a static recommendation. The user needs a visible plan they can understand and question; the agent needs structured tools it can call, inspect, and revise. WebMCP lets one project description trigger the real product workflow, update visible page state, and return the same evidence-backed blueprint to the agent.

The page registers seven tools: build, inspect, apply a constraint, refine, survey, consult, and render. Together, a person and agent can create and improve one inspectable execution system instead of passing disconnected lists between a chat and a website. An agent can explain why Expo was selected, open that same explanation for the person, then apply an offline-first requirement and visibly record which choices stayed or changed.

### How we built it

Stack Blueprint is an open-source Next.js and TypeScript application hosted on Vercel. Its client registers tools with `document.modelContext.registerTool(...)`; tool calls update the same React state as the manual interface. A bounded same-origin API proxy calls only VibeLeaderboard's public, read-only catalog and Intel tools. No private source code, credentials, transcripts, or article bodies are shipped.

Recommendations are conditional. Selecting Expo activates Expo MCP, exact Expo project/design/router skills, React and Expo diagnostics, and device automation. Selecting Supabase activates Supabase MCP and database guidance. Live catalog matches are marked as verified; curated fallbacks remain linked to their official sources. Prototype briefs intentionally defer production-only services. Intel results are filtered to the project's risks and rewritten as imperative build instructions rather than displayed as a generic reading feed.

### Challenges

The hardest problem was resisting a template-driven stack picker. Similar apps do not prove that their choices were correct, and a dense alternatives grid made the result harder to use. We removed automatic product matching and focused the consultation on the more defensible value: a maintained, stack-specific AI workspace.

We also had to make external evidence useful without making it authoritative. Catalog and Intel results are bounded, sanitized, cited, and treated as untrusted inputs. The initial blueprint remains a first draft that the calling agent can refine only with a complete replacement plan and explicit reasoning.

### What we learned

The framework decision is often the easy part. Execution quality improves when a stack selection automatically brings along its official MCPs, exact implementation skills, deterministic diagnostics, and proof requirements. WebMCP is especially useful when the browser experience and the agent's structured state are the same object instead of two approximations.

### What's next

Next we want to expand the maintained tool mappings, add repeatable browser evals for more project types, and let teams export the final blueprint directly into repository instructions and agent workspace configuration.

## Why this is a strong fit for WebMCP

Choosing a software stack is not only a question-and-answer task. The useful result is shared, inspectable state: a builder and browser agent should be able to create the same blueprint, watch it take shape, inspect a selected tool, refine the plan, and carry the final build brief into implementation. WebMCP lets the agent operate the visible product rather than returning a disconnected chat list.

The browser registers seven tools for building, inspecting, applying constraints, refining, surveying, consulting, and rendering a blueprint. A single project description triggers the page to infer constraints, consult VibeLeaderboard's public catalog and Intel, select the application stack, attach technology-specific agent tooling, and draw the result. The user can click any node to understand its role and evidence while the agent can inspect and revise the same structured state.

## Better human-agent experience

Plain agents commonly return a familiar stack and stop. Stack Blueprint adds the difficult execution layer: it matches selected products to official MCPs, exact platform skills, deterministic diagnostics, device/browser verification, quality gates, and source-backed project instructions. For example, choosing Expo and NativeWind activates Expo MCP, exact Expo project/design/Tailwind/router skills, Callstack React Native skills, React Doctor, Expo Doctor, and agent-device. Choosing Supabase activates scoped Supabase MCP plus database and RLS guidance.

The system still uses judgment. Curated mappings decide which companion tools belong with the chosen stack. The live catalog verifies matching picks and returns additional candidates, but never promotes a candidate merely because search ranked it highly. Intel is filtered to the project's engineering risks and converted into imperative instructions rather than shown as a random article feed. Production-only services are deferred when a prototype does not need them.

This collaboration was difficult before WebMCP because the agent's recommendation, the user's visible plan, current external evidence, and later refinements lived in separate surfaces. Here they are one shared object on the page.

## Implementation

Stack Blueprint is a public Next.js application hosted on Vercel. It calls only VibeLeaderboard's public read-only MCP tools through a bounded same-origin proxy. No private VibeLeaderboard code, credentials, transcripts, or article bodies are included. Untrusted catalog and Intel strings are sanitized and rendered as text.

The client registers seven tools with `document.modelContext.registerTool(...)` and aborts the registrations with the page lifecycle. Tool calls update the same React state used by the manual form. The primary tool runs public catalog and Intel consultations in parallel, returns structured evidence and an execution playbook, then slowly reveals the selected nodes in the interface. Inspection opens the visible choice dialog. Constraint application re-runs consultation, updates the drawing, and stores a visible revision delta.

## URLs

- Live application: https://stack-blueprint.vercel.app
- Public source: https://github.com/Avanderheyde/vibe-intel-desk
- License: MIT (`LICENSE` at repository root)

## Demo video plan (2:35 target)

### 0:00-0:20 - The problem

Show the same playful mobile-app prompt given to a plain coding agent: "Build a silly mobile app where roommates photograph the fridge, claim their food, and vote on suspicious leftovers." The plain answer chooses Expo, React Native, and Supabase but gives the builder no specialized workspace. Briefly show generic generated UI, no native verification, and the agent declaring success from code alone.

Voiceover: "Picking Expo was not the hard part. Equipping the agent to execute Expo well was."

### 0:20-0:45 - WebMCP handoff

Open Stack Blueprint in the compatible browser. Ask the browser agent to use `build_project_blueprint` with the same prompt. Show the tool being discovered and called without filling a stack questionnaire.

### 0:45-1:25 - The drawing builds itself

Let the drawing reveal the equipped AI workspace first: Codex/model, Expo MCP, exact Expo project/design/Tailwind/router skills, Callstack React Native skills, React Doctor, Expo Doctor, agent-device, Supabase MCP, and verification. Then reveal the supporting application and ship/operate sheets.

Click Expo MCP, expo-tailwind-setup, and agent-device. Show the concise reason each was selected and its official source.

### 1:25-1:50 - Current evidence becomes instructions

Click Vibe Intel. Show the maintained workspace candidates it evaluated and the project instructions extracted from current engineering Intel: define acceptance criteria first, use an independent evaluator, keep repository context explicit, and require device-level evidence.

### 1:50-2:18 - The blueprint changes the build

Return to the implementation. Show the equipped agent using the official Expo skill for NativeWind setup, React Doctor for a concrete code finding, and agent-device to open the simulator and capture proof. Contrast the resulting native-feeling, verified screen with the generic first pass.

### 2:18-2:35 - Human and agent together

Ask why Expo was chosen, then apply “Keep Expo, but optimize this for an offline-first prototype” through `apply_project_constraint`. Show revision 02 preserve Expo and add Expo SQLite, NetInfo, and `expo-examples`. End on the completed drawing and copied build brief.

Voiceover: "Stack Blueprint does not replace the builder's judgment. It gives the builder and agent a current, inspectable execution system they can improve together."

## Recording checklist

- Record at 1440p or 1080p with readable browser zoom.
- Keep the final video under three minutes and include narration.
- Use the deployed public URL, not localhost.
- Show WebMCP tool discovery and the complete build, inspect, and apply-constraint sequence.
- Show visible page state changing from the tool call.
- Show one node inspection and one refinement.
- Upload publicly or unlisted to YouTube and verify playback in a signed-out window.
