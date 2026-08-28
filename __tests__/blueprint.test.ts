import { describe, expect, it } from "vitest";
import { draftChoices, inferProfile } from "@/components/research-desk";

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
  });
});
