import { describe, expect, it } from "vitest";
import { buildCatalogPacket, buildIntelPacket, choiceContextFor, deferredSuggestionsFor, draftChoices, inferProfile, specificStackFor, summarizeRevision, verifyWorkspacePicks } from "@/components/research-desk";

describe("automatic blueprint consultation", () => {
  it("infers a playful mobile prototype without asking stack questions", () => {
    const profile = inferProfile("A silly mobile app for roommates with photo uploads and push notifications");
    expect(profile).toEqual({ projectKind: "mobile", priority: "speed", stage: "prototype" });

    const choices = draftChoices("A silly mobile app for roommates with photo uploads and push notifications", profile);
    expect(choices).toEqual(expect.objectContaining({
      interface: "native",
      architecture: "managed",
      storage: "upload-service",
      "coding-agent": "terminal-agent",
      research: "curated-intel",
    }));
  });

  it("omits services that a small project does not need", () => {
    const project = "A weekend web app that generates random excuses";
    const choices = draftChoices(project, inferProfile(project));
    expect(choices.cms).toBe("not-needed");
    expect(choices.payments).toBe("not-needed");

    const explicitlyFree = "A roommate app with no payments";
    expect(draftChoices(explicitlyFree, inferProfile(explicitlyFree)).payments).toBe("not-needed");

    const noAccountsOrPayments = "A static portfolio with no accounts or payments";
    const constrainedChoices = draftChoices(noAccountsOrPayments, inferProfile(noAccountsOrPayments));
    expect(constrainedChoices.email).toBe("not-needed");
    expect(constrainedChoices.payments).toBe("not-needed");
  });

  it("does not mistake client files for a CLI library", () => {
    expect(inferProfile("A SaaS web app where design teams review client files").projectKind).toBe("web");
  });

  it("does not classify every project mentioning a coding agent as an AI product", () => {
    expect(inferProfile("A recipe web app that my coding agent will build").projectKind).toBe("web");
    expect(inferProfile("An AI agent that reconciles invoices").projectKind).toBe("ai-product");
    expect(inferProfile("A proof of concept for neighborhood plant swaps").stage).toBe("prototype");
  });

  it("does not mistake words containing api for an API service", () => {
    const project = "A private offline mood journal for therapists that never uploads patient notes and works as an installable web app";
    const profile = inferProfile(project);
    const names = specificStackFor(project, profile, draftChoices(project, profile)).map((pick) => pick.name);
    expect(profile.projectKind).toBe("web");
    expect(names).toEqual(expect.arrayContaining(["Vite", "Dexie", "Workbox", "Cloudflare Pages"]));
    expect(names).not.toContain("Railway");
  });

  it("treats an explicit Stripe integration as a payment dependency", () => {
    const project = "A backend webhook service that receives Stripe events and verifies signatures";
    const profile = inferProfile(project);
    const names = specificStackFor(project, profile, draftChoices(project, profile)).map((pick) => pick.name);
    expect(names).toEqual(expect.arrayContaining(["Stripe", "Stripe MCP"]));
  });

  it("returns specific software, harness, model, and skill picks", () => {
    const project = "A silly mobile app for roommates with photo uploads and push notifications, no payments";
    const profile = inferProfile(project);
    const picks = specificStackFor(project, profile, draftChoices(project, profile));
    const names = picks.map((pick) => pick.name);

    expect(names).toEqual(expect.arrayContaining([
      "Expo", "React Native", "NativeWind", "Supabase", "EAS Build",
      "Codex", "GPT-5.6 Sol", "React Doctor", "Expo MCP", "expo-project-structure", "expo-design-system", "expo-native-ui", "expo-animation", "expo-tailwind-setup", "expo-router",
      "Callstack React Native Skills", "Expo Doctor", "agent-device", "Supabase MCP", "supabase", "verification",
    ]));
    expect(names).not.toContain("OpenAI Responses API");
    expect(names).not.toContain("Cloudinary");
    expect(names).not.toContain("Stripe");
    expect(picks.every((pick) => pick.why && pick.sourceUrl)).toBe(true);
  });

  it("respects an explicit non-OpenAI harness preference", () => {
    const project = "A mobile prototype built with Claude Code for roommates sharing food";
    const profile = inferProfile(project);
    const names = specificStackFor(project, profile, draftChoices(project, profile)).map((pick) => pick.name);
    expect(names).toEqual(expect.arrayContaining(["Claude Code", "Claude model"]));
    expect(names).not.toEqual(expect.arrayContaining(["Codex", "GPT-5.6 Sol"]));
  });

  it("marks maintained catalog matches on visible workspace picks", () => {
    const project = "A silly mobile app for roommates";
    const profile = inferProfile(project);
    const picks = specificStackFor(project, profile, draftChoices(project, profile));
    const verified = verifyWorkspacePicks(picks, [
      { id: "expo-mcp", title: "Expo MCP Server", tool_type: "mcp_server", maintained: true, url: "https://example.com/expo-mcp" },
      { id: "supabase-mcp", title: "Supabase MCP", tool_type: "mcp_server", interfaces: ["mcp"], maintained: true, url: "https://example.com/supabase-mcp" },
      { id: "stale", title: "React Doctor", tool_type: "utility", maintained: false, url: "https://example.com/stale" },
    ]);
    expect(verified.find((pick) => pick.name === "Expo MCP")?.evidence).toEqual(expect.objectContaining({ status: "catalog-verified", catalogTitle: "Expo MCP Server" }));
    expect(verified.find((pick) => pick.name === "Supabase MCP")?.evidence?.status).toBe("catalog-verified");
    expect(verified.find((pick) => pick.name === "supabase")?.evidence?.status).toBe("official-mapping");
    expect(verified.find((pick) => pick.name === "supabase-postgres-best-practices")?.evidence?.status).toBe("official-mapping");
    expect(verified.find((pick) => pick.name === "React Doctor")?.evidence?.status).toBe("official-mapping");
  });

  it.each([
    ["A Chrome extension that summarizes GitHub pull requests", "browser-extension", ["WXT", "React", "OpenAI Responses API"], ["Next.js"]],
    ["A static portfolio for a ceramic artist with a contact form", "static-site", ["Astro", "Cloudflare Pages"], ["Supabase"]],
    ["A command-line tool that scans repositories for secrets", "library", ["Rust", "Clap"], ["React"]],
    ["A Python API ingesting 50 million IoT events with anomaly detection", "service", ["FastAPI", "Redpanda", "ClickHouse"], ["Hono", "Railway"]],
    ["A small online shop with inventory, shipping, taxes, and discounts", "commerce", ["Shopify", "Dawn", "Shopify Dev MCP"], ["Supabase", "Stripe"]],
    ["A Slack bot that posts a weekly team digest", "automation", ["Slack Bolt", "Trigger.dev Cloud"], ["Resend", "Vercel", "PostHog"]],
    ["A local desktop photo organizer for Mac that never uploads images", "desktop", ["Tauri", "SQLite"], ["Supabase", "Cloudinary"]],
  ])("adapts the stack for %s", (project, kind, included, excluded) => {
    const profile = inferProfile(project);
    const names = specificStackFor(project, profile, draftChoices(project, profile)).map((pick) => pick.name);
    expect(profile.projectKind).toBe(kind);
    expect(names).toEqual(expect.arrayContaining(included));
    for (const name of excluded) expect(names).not.toContain(name);
  });

  it("uses a realtime voice API for a spoken tutor", () => {
    const project = "An AI voice tutor with low-latency spoken conversations";
    const profile = inferProfile(project);
    const names = specificStackFor(project, profile, draftChoices(project, profile)).map((pick) => pick.name);
    expect(names).toContain("OpenAI Realtime API");
    expect(names).not.toContain("OpenAI Responses API");
  });

  it("keeps Expo and adds an offline-first mobile layer when the project constraint changes", () => {
    const original = "A silly mobile app where roommates photograph the fridge, claim their food, and vote on suspicious leftovers";
    const constrained = `${original}. Additional constraint: Keep Expo, but optimize this for an offline-first prototype.`;
    const beforeProfile = inferProfile(original);
    const afterProfile = inferProfile(constrained);
    const before = specificStackFor(original, beforeProfile, draftChoices(original, beforeProfile));
    const after = specificStackFor(constrained, afterProfile, draftChoices(constrained, afterProfile));
    const afterNames = after.map((pick) => pick.name);
    const revision = summarizeRevision(before, after, "Keep Expo, but optimize this for an offline-first prototype.", ["Expo"]);

    expect(afterNames).toEqual(expect.arrayContaining(["Expo", "Expo SQLite", "NetInfo", "expo-examples"]));
    expect(afterNames).toEqual(expect.arrayContaining(["Supabase", "Expo MCP", "Expo Doctor", "agent-device"]));
    expect(revision.preserved).toEqual(["Expo"]);
    expect(revision.added).toEqual(expect.arrayContaining(["Expo SQLite", "NetInfo", "expo-examples"]));
    expect(revision.removed).toEqual([]);
  });

  it("returns a project-specific tradeoff when an agent inspects Expo", () => {
    const project = "A mobile app for roommates";
    const profile = inferProfile(project);
    const expo = specificStackFor(project, profile, draftChoices(project, profile)).find((pick) => pick.id === "expo");
    expect(expo).toBeDefined();
    expect(choiceContextFor(expo!).tradeoff).toMatch(/Expo-compatible|native/i);
    expect(choiceContextFor(expo!).alternatives.length).toBeGreaterThan(0);
  });

  it("adds a professional UI execution layer instead of stopping at the framework", () => {
    const project = "A straightforward customer support web app";
    const profile = inferProfile(project);
    const names = specificStackFor(project, profile, draftChoices(project, profile)).map((pick) => pick.name);
    expect(names).toEqual(expect.arrayContaining(["React Doctor", "React Best Practices", "Impeccable", "Sentry MCP", "Vercel MCP", "verification"]));
  });

  it("only adds companion agent tools when their parent technology is selected", () => {
    const staticProject = "A static portfolio with no accounts or payments";
    const profile = inferProfile(staticProject);
    const names = specificStackFor(staticProject, profile, draftChoices(staticProject, profile)).map((pick) => pick.name);
    expect(names).not.toEqual(expect.arrayContaining(["React Doctor", "Supabase MCP", "Sentry MCP", "Stripe MCP", "Vercel MCP"]));

    const paidApp = "A production React SaaS app with subscriptions";
    const paidProfile = inferProfile(paidApp);
    const paidNames = specificStackFor(paidApp, paidProfile, draftChoices(paidApp, paidProfile)).map((pick) => pick.name);
    expect(paidNames).toEqual(expect.arrayContaining(["Supabase MCP", "Sentry MCP", "Stripe MCP", "Vercel MCP"]));
  });

  it("keeps prototype production tools deferred and CI outside the AI branch", () => {
    const project = "A weekend mobile prototype for roommates";
    const profile = inferProfile(project);
    const picks = specificStackFor(project, profile, draftChoices(project, profile));
    expect(picks.find((pick) => pick.name === "GitHub Actions")?.branch).toBe("services");
    expect(deferredSuggestionsFor(project, profile, picks).map((item) => item.name)).toEqual(["Sentry", "PostHog"]);
    expect(picks.map((pick) => pick.name)).not.toEqual(expect.arrayContaining(["Sentry", "PostHog"]));
  });

  it("keeps a local-only medical product off cloud data and telemetry services", () => {
    const project = "A privacy-first offline medical journal that never sends data to a cloud";
    const profile = inferProfile(project);
    const names = specificStackFor(project, profile, draftChoices(project, profile)).map((pick) => pick.name);
    expect(names).toEqual(expect.arrayContaining(["Dexie", "Web Crypto API", "Workbox"]));
    expect(names).not.toEqual(expect.arrayContaining(["Supabase", "PostHog", "Sentry"]));
  });

  it("returns only useful, citable research and maintained related catalog entries", () => {
    const intel = buildIntelPacket([
      { id: "strong-1", title: "Strong", why: "A concrete useful takeaway.", relevance: 0.7, intel_page: "https://example.com/intel" },
      { id: "weak", title: "Weak", why: "Weak match.", relevance: 0.1, intel_page: "https://example.com/weak" },
      { id: "strong-2", title: "Strong 2", summary: "Another useful source.", relevance: 0.6, source_url: "https://example.com/source" },
      { id: "strong-3", title: "Strong 3", description: "Third useful source.", relevance: 0.5, source_url: "https://example.com/third" },
    ]);
    expect(intel.map((item) => item.title)).toEqual(["Strong", "Strong 2", "Strong 3"]);

    const agentIntel = buildIntelPacket([
      { id: "media", title: "New video model", why: "A multimodal image and video generation release.", relevance: 0.8, intel_page: "https://example.com/media" },
      { id: "harness", title: "Harness design for coding agents", why: "Use a separate evaluator during software development.", relevance: 0.6, intel_page: "https://example.com/harness" },
    ]);
    expect(agentIntel.map((item) => item.title)).toEqual(["Harness design for coding agents"]);
    expect(agentIntel[0]?.instruction).toMatch(/acceptance criteria|fresh evaluator/i);

    const focusedIntel = buildIntelPacket([
      { id: "generic", title: "Agent harness advice", why: "Use a fresh evaluator for software work.", relevance: 0.8, intel_page: "https://example.com/generic" },
      { id: "design", title: "Design systems for React", why: "Keep interface tokens consistent.", relevance: 0.45, intel_page: "https://example.com/design" },
    ], "React interface design accessibility");
    expect(focusedIntel[0]?.title).toBe("Design systems for React");

    const stackAwareIntel = buildIntelPacket([
      { id: "wrong-host", title: "Faster deploys for ISR pages on Vercel", why: "Optimize ISR releases.", relevance: 0.8, intel_page: "https://example.com/vercel" },
      { id: "right-stack", title: "Offline React application testing", why: "Verify service workers and local state.", relevance: 0.6, intel_page: "https://example.com/offline" },
    ], "React Vite Workbox Cloudflare offline application testing");
    expect(stackAwareIntel.map((item) => item.title)).toEqual(["Offline React application testing"]);

    const incompleteFallback = buildIntelPacket([
      { id: "fallback", title: "Practical deployment guidance", why: "Practical guidance:", description: "Short", relevance: 0.8, intel_page: "https://example.com/fallback" },
    ]);
    expect(incompleteFallback[0]?.instruction).not.toMatch(/Practical guidance:\s*$/);
    expect(incompleteFallback[0]?.instruction).toContain("Practical deployment guidance");

    const catalog = buildCatalogPacket([
      { id: "related", title: "Related", relevance: 0.6, maintained: true, url: "https://example.com/related", why: "A nearby product pattern." },
      { id: "stale", title: "Stale", relevance: 0.8, maintained: false, url: "https://example.com/stale" },
      { id: "noise", title: "Noise", relevance: 0.2, maintained: true, url: "https://example.com/noise" },
      { id: "typed", title: "Typed Skill", relevance: null, structured_match: true, tool_type: "extension", maintained: true, url: "https://example.com/typed" },
    ]);
    expect(catalog.map((item) => item.title)).toEqual(["Related", "Typed Skill"]);
    expect(catalog[1]?.category).toBe("EXTENSION");

    const focusedCatalog = buildCatalogPacket([
      { id: "match", title: "React Native Skills", structured_match: true, tool_type: "extension", maintained: true, url: "https://example.com/match", why: "Mobile performance guidance." },
      { id: "noise-typed", title: "Research Helper", structured_match: true, tool_type: "extension", maintained: true, url: "https://example.com/noise", why: "Research social posts." },
    ], [], "React Native mobile performance");
    expect(focusedCatalog.map((item) => item.title)).toEqual(["React Native Skills"]);
  });
});
