# Stack Blueprint submission kit

## Elevator pitch (200 characters maximum)

Describe your software. Stack Blueprint uses WebMCP to draft its stack, equip your coding agent with the right skills, MCPs and checks, then explain every choice as the blueprint draws itself.

## Why this is a strong fit for WebMCP

Choosing a software stack is not only a question-and-answer task. The useful result is shared, inspectable state: a builder and browser agent should be able to create the same blueprint, watch it take shape, inspect a selected tool, refine the plan, and carry the final build brief into implementation. WebMCP lets the agent operate the visible product rather than returning a disconnected chat list.

The browser registers six tools for building, inspecting, refining, surveying, consulting, and rendering a blueprint. A single project description triggers the page to infer constraints, consult VibeLeaderboard's public catalog and Intel, select the application stack, attach technology-specific agent tooling, and draw the result. The user can click any node to understand its role and evidence while the agent can inspect the same structured state.

## Better human-agent experience

Plain agents commonly return a familiar stack and stop. Stack Blueprint adds the difficult execution layer: it matches selected products to official MCPs, exact platform skills, deterministic diagnostics, device/browser verification, quality gates, and source-backed project instructions. For example, choosing Expo and NativeWind activates Expo MCP, exact Expo project/design/Tailwind/router skills, Callstack React Native skills, React Doctor, Expo Doctor, and agent-device. Choosing Supabase activates scoped Supabase MCP plus database and RLS guidance.

The system still uses judgment. Related products are evidence, not templates to copy. Intel is filtered to the project's engineering risks and converted into imperative instructions rather than shown as a random article feed. Production-only services are deferred when a prototype does not need them.

This collaboration was difficult before WebMCP because the agent's recommendation, the user's visible plan, current external evidence, and later refinements lived in separate surfaces. Here they are one shared object on the page.

## Implementation

Stack Blueprint is a public Next.js application hosted on Vercel. It calls only VibeLeaderboard's public read-only MCP tools through a bounded same-origin proxy. No private VibeLeaderboard code, credentials, transcripts, or article bodies are included. Untrusted catalog and Intel strings are sanitized and rendered as text.

The client registers six tools with `document.modelContext.registerTool(...)` and aborts the registrations with the page lifecycle. Tool calls update the same React state used by the manual form. The primary tool runs public catalog and Intel consultations in parallel, returns structured evidence and an execution playbook, then slowly reveals the selected nodes in the interface.

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

Click Vibe Intel. Show that the page checked related VibeLeaderboard products and current engineering Intel but did not copy them. Highlight the extracted project instructions: define acceptance criteria first, use an independent evaluator, keep repository context explicit, and require device-level evidence.

### 1:50-2:18 - The blueprint changes the build

Return to the implementation. Show the equipped agent using the official Expo skill for NativeWind setup, React Doctor for a concrete code finding, and agent-device to open the simulator and capture proof. Contrast the resulting native-feeling, verified screen with the generic first pass.

### 2:18-2:35 - Human and agent together

Ask why one node was chosen, then have the agent refine one decision through `refine_project_blueprint`. End on the completed drawing and copied build brief.

Voiceover: "Stack Blueprint does not replace the builder's judgment. It gives the builder and agent a current, inspectable execution system they can improve together."

## Recording checklist

- Record at 1440p or 1080p with readable browser zoom.
- Keep the final video under three minutes and include narration.
- Use the deployed public URL, not localhost.
- Show WebMCP tool discovery and at least one real tool call.
- Show visible page state changing from the tool call.
- Show one node inspection and one refinement.
- Upload publicly or unlisted to YouTube and verify playback in a signed-out window.
