import { describe, expect, it } from "vitest";
import { buildCatalogPacket, buildIntelPacket, draftChoices, inferProfile, specificStackFor } from "@/components/research-desk";

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

  it("returns specific software, harness, model, and skill picks", () => {
    const project = "A silly mobile app for roommates with photo uploads and push notifications, no payments";
    const profile = inferProfile(project);
    const picks = specificStackFor(project, profile, draftChoices(project, profile));
    const names = picks.map((pick) => pick.name);

    expect(names).toEqual(expect.arrayContaining([
      "Expo", "React Native", "NativeWind", "Supabase", "EAS Build",
      "Codex", "GPT-5.6 Sol", "React Doctor", "Expo Doctor", "frontend-design", "Impeccable", "Supabase MCP", "supabase", "verification",
    ]));
    expect(names).not.toContain("OpenAI Responses API");
    expect(names).not.toContain("Cloudinary");
    expect(names).not.toContain("Stripe");
    expect(picks.every((pick) => pick.why && pick.sourceUrl)).toBe(true);
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

  it("adds a professional UI execution layer instead of stopping at the framework", () => {
    const project = "A straightforward customer support web app";
    const profile = inferProfile(project);
    const names = specificStackFor(project, profile, draftChoices(project, profile)).map((pick) => pick.name);
    expect(names).toEqual(expect.arrayContaining(["React Doctor", "frontend-design", "Impeccable", "Sentry MCP", "Vercel MCP", "verification"]));
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

    const catalog = buildCatalogPacket([
      { id: "related", title: "Related", relevance: 0.6, maintained: true, url: "https://example.com/related", why: "A nearby product pattern." },
      { id: "stale", title: "Stale", relevance: 0.8, maintained: false, url: "https://example.com/stale" },
      { id: "noise", title: "Noise", relevance: 0.2, maintained: true, url: "https://example.com/noise" },
    ]);
    expect(catalog.map((item) => item.title)).toEqual(["Related"]);
  });
});
