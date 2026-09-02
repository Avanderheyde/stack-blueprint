# Stack Blueprint demo: WebMCP collaboration cut

Target runtime: 2 minutes 35 seconds to 2 minutes 50 seconds. Read naturally. The bracketed lines are visual directions and should not be recorded.

## Narration and shot map

[0:00: Start on the empty Stack Blueprint prompt. The product name draws onto the page.]

This is Stack Blueprint. Tell it what you want to build, and it plans the software and AI tools your coding agent needs.

[0:09: Type the complete roommate-fridge prompt in large, readable text.]

For this demo, I want a silly mobile app where roommates photograph the fridge, claim their food, and vote on suspicious leftovers.

[0:18: Briefly draw Expo, React Native, and Supabase by themselves.]

A normal agent can suggest Expo, React Native, and Supabase. Those are sensible choices, but it still has to guess how to use them well.

[0:31: Show the compatible browser discovering the page tools. The agent calls `build_project_blueprint`. The drawing begins.]

Stack Blueprint turns that answer into shared work. With WebMCP, the agent submits the idea directly to the page, and the visible blueprint draws itself.

[0:46: Animate three consultation steps: understand the project, search current tools and advice, equip the workspace.]

Behind the blueprint is VibeLeaderboard, a maintained index of AI tools and recent agent-building advice. Stack Blueprint searches it, filters out unrelated results, and keeps only what can help with this project.

[1:00: Reveal the equipped AI workspace above the software stack. Highlight the named groups rather than every individual logo.]

Because this app uses Expo, React Native, and Supabase, the workspace adds matching connections, mobile and design skills, React Doctor, Expo Doctor, and device testing. Now the agent has current guidance and a way to prove the real app works.

[1:19: In the agent, ask: “Why was Expo selected?” Show `inspect_project_blueprint` being called. The Expo explanation opens on the page.]

I ask why Expo was selected. The inspection tool opens the same explanation for both of us: why it fits, its tradeoff, alternatives, and official source.

[1:39: Ask: “Keep Expo, but optimize this for an offline-first prototype.” Show `apply_project_constraint` being called.]

Then I add a real constraint: keep Expo, but make the prototype work offline. The agent applies that requirement to the existing blueprint instead of starting over.

[1:50: Show revision 02. Highlight KEPT: Expo, then draw Expo SQLite, NetInfo, and `expo-examples`.]

Revision two keeps Expo and adds Expo SQLite, NetInfo, and official Expo examples for local data, connection-aware syncing, and implementation guidance. It also names the synchronization tradeoffs.

[2:08: Open Vibe Intel briefly. Show unrelated results disappearing and the retained advice becoming short project instructions.]

Relevant engineering advice becomes instructions the agent can execute: define success before coding, keep context clear, review independently, and require proof from the running app.

[2:20: Zoom out to the full revised blueprint. Briefly show the registered-tool code, then return to the completed page.]

Under the hood, the page registers seven WebMCP tools. They use the same logic as the visible controls, so agent actions update the page instead of creating a disconnected chat answer.

[2:36: End card with the complete revised blueprint and live URL.]

Stack Blueprint gives builders and their agents one current, inspectable plan they can understand and improve together.

## Why this cut fits the judging criteria

- WebMCP leverage: shows discovery and three real calls that build, inspect, and revise visible page state.
- Execution: demonstrates a complete public product workflow rather than an isolated protocol example.
- Potential impact: helps AI-assisted builders find the stack-specific tools and instructions they otherwise need to research themselves.
- Creativity and ambition: turns stack planning into a shared, revisioned architectural drawing for a person and agent.

## Recording notes

- Record each paragraph as a separate take with one second of quiet before and after it.
- Keep the microphone 6 to 10 inches away and speak slightly slower during product names.
- Say “Vibe Leaderboard” as two words and “Web M C P” as individual letters if that feels clearer aloud.
- If a sentence feels crowded, pause after the first complete thought. Do not rush the list of tools.
- WAV, M4A, or high-quality MP3 are all fine.
