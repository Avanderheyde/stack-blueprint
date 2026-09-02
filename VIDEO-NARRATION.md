# Stack Blueprint demo narration

Read each paragraph as a separate take. Leave about one second of silence before and after each take. The full read should land near two minutes and forty seconds at a relaxed pace.

This is Stack Blueprint. Tell it what you want to build, and it plans the software and AI tools your coding agent needs.

For this demo, I want a silly mobile app where roommates photograph the fridge, claim their food, and vote on suspicious leftovers.

A normal agent can suggest Expo, React Native, and Supabase. Those are sensible choices, but it still has to guess how to use them well.

Stack Blueprint turns that answer into shared work. With Web M C P, the agent submits the idea directly to the page, and the visible blueprint draws itself.

Behind the blueprint is Vibe Leaderboard, a maintained index of AI tools and recent advice for building with agents. Stack Blueprint searches it, filters out unrelated results, and keeps only what can help with this project.

Because the app uses Expo, React Native, and Supabase, Blueprint adds matching connections, mobile and design skills, React Doctor, Expo Doctor, and device testing. The agent now has current guidance and a way to prove the real app works.

Next, I ask why Expo was selected. The inspection tool opens the same explanation for both of us: why it fits, its tradeoff, its alternatives, and an official source.

Then I add a real constraint: keep Expo, but make the prototype work offline. The agent applies that requirement to the existing blueprint instead of starting over.

Revision two keeps Expo and adds three pieces for offline work: Expo SQLite for local data, NetInfo for connection-aware syncing, and an official Expo example to guide the implementation. It also makes the synchronization tradeoffs explicit.

Relevant engineering advice becomes instructions the agent can execute: define success before coding, keep context clear, review independently, and require proof from the running app.

The page registers seven Web M C P tools. They use the same logic as the controls on screen, so the agent changes the actual page instead of returning another answer in chat.

Stack Blueprint gives builders and their agents one current, inspectable plan they can understand and improve together.
