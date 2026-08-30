import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import rawCaptions from "../public/captions.json";

const captions = rawCaptions as Caption[];

const C = {
  ink: "#0b2841",
  blue: "#0d6bff",
  cyan: "#54d8ff",
  paper: "#eef7f8",
  panel: "#f7fbfb",
  line: "#84aebc",
  muted: "#547487",
  yellow: "#ffd74a",
  coral: "#ff665c",
  green: "#4fd39a",
  white: "#ffffff",
};

const titleFont = '"Avenir Next Condensed", "Arial Narrow", sans-serif';
const mono = '"SFMono-Regular", Menlo, Consolas, monospace';

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const BlueprintBackground = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.paper,
      backgroundImage: `linear-gradient(rgba(13,107,255,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(13,107,255,.09) 1px, transparent 1px), linear-gradient(rgba(13,107,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(13,107,255,.035) 1px, transparent 1px)`,
      backgroundSize: "80px 80px, 80px 80px, 16px 16px, 16px 16px",
    }}
  />
);

const CornerMarks = () => (
  <>
    {[[40, 40], [1840, 40], [40, 1000], [1840, 1000]].map(([left, top], index) => (
      <div key={index} style={{ position: "absolute", left, top, width: 40, height: 40 }}>
        <div style={{ position: "absolute", left: 0, top: 19, width: 40, height: 2, background: C.blue, opacity: 0.38 }} />
        <div style={{ position: "absolute", left: 19, top: 0, width: 2, height: 40, background: C.blue, opacity: 0.38 }} />
      </div>
    ))}
  </>
);

const BrandBug = ({ sheet }: { sheet: string }) => (
  <div style={{ position: "absolute", left: 68, top: 54, display: "flex", alignItems: "center", gap: 18, fontFamily: mono, color: C.ink }}>
    <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: "0.16em" }}>STACK BLUEPRINT</div>
    <div style={{ width: 1, height: 20, background: C.line }} />
    <div style={{ fontSize: 14, letterSpacing: "0.12em", color: C.muted }}>{sheet}</div>
  </div>
);

const Scene = ({ children, sheet }: { children: React.ReactNode; sheet: string }) => (
  <AbsoluteFill style={{ color: C.ink, overflow: "hidden" }}>
    <BlueprintBackground />
    <CornerMarks />
    <BrandBug sheet={sheet} />
    {children}
  </AbsoluteFill>
);

const DrawLine = ({ x, y, width, delay = 0, vertical = false }: { x: number; y: number; width: number; delay?: number; vertical?: boolean }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", left: x, top: y, width: vertical ? 2 : width * progress, height: vertical ? width * progress : 2, background: C.blue, transformOrigin: "top left" }} />;
};

const LogoNode = ({ name, role, color = C.blue, delay = 0, compact = false }: { name: string; role: string; color?: string; delay?: number; compact?: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 150, mass: 0.7 }, durationInFrames: 25 });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 12 : 18,
        border: `2px solid ${C.ink}`,
        background: C.panel,
        padding: compact ? "12px 16px" : "18px 22px",
        minWidth: compact ? 210 : 290,
        boxShadow: `6px 6px 0 ${C.ink}16`,
        transform: `translateY(${(1 - enter) * 20}px) scale(${0.94 + enter * 0.06})`,
        opacity: enter,
      }}
    >
      <div style={{ width: compact ? 40 : 52, height: compact ? 40 : 52, display: "grid", placeItems: "center", color: C.white, background: color, fontFamily: titleFont, fontWeight: 900, fontSize: compact ? 22 : 28 }}>
        {name.replace(/[^A-Za-z0-9]/g, "").slice(0, 1)}
      </div>
      <div>
        <div style={{ fontFamily: titleFont, fontSize: compact ? 22 : 28, fontWeight: 800, letterSpacing: "0.01em" }}>{name}</div>
        <div style={{ fontFamily: mono, marginTop: 3, fontSize: compact ? 11 : 13, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{role}</div>
      </div>
    </div>
  );
};

const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = spring({ frame: frame - 8, fps, config: { damping: 16, stiffness: 110 }, durationInFrames: 40 });
  const line = interpolate(frame, [20, 65], [0, 1], clamp);
  return (
    <Scene sheet="SHEET 00 / INTRODUCTION">
      <div style={{ position: "absolute", left: 170, top: 260, width: 1580 }}>
        <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: "0.2em", color: C.blue, marginBottom: 26 }}>WEBMCP SOFTWARE ARCHITECT</div>
        <h1 style={{ margin: 0, fontFamily: titleFont, fontSize: 168, lineHeight: 0.85, letterSpacing: "-0.045em", textTransform: "uppercase", transform: `translateY(${(1 - title) * 50}px)`, opacity: title }}>
          Stack <span style={{ color: C.blue }}>Blueprint</span>
        </h1>
        <div style={{ width: `${line * 100}%`, height: 5, background: C.ink, margin: "42px 0 34px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <p style={{ margin: 0, maxWidth: 1050, fontFamily: titleFont, fontWeight: 600, fontSize: 42, lineHeight: 1.15 }}>
            Draw the product stack. Equip the coding agent to execute it well.
          </p>
          <div style={{ fontFamily: mono, color: C.muted, textAlign: "right", fontSize: 14, lineHeight: 1.8 }}>PROJECT NO. 01<br />ISSUED FOR DEMO<br />REV 08.30.26</div>
        </div>
      </div>
    </Scene>
  );
};

const ProblemScene = () => {
  const frame = useCurrentFrame();
  const stamp = spring({ frame: frame - 84, fps: 30, config: { damping: 12, stiffness: 180 }, durationInFrames: 25 });
  return (
    <Scene sheet="SHEET 01 / THE GAP">
      <div style={{ position: "absolute", left: 120, top: 160, width: 1680 }}>
        <div style={{ fontFamily: mono, fontSize: 18, color: C.muted, letterSpacing: "0.14em" }}>A SENSIBLE PRODUCT STACK</div>
        <h2 style={{ fontFamily: titleFont, fontSize: 74, margin: "12px 0 44px", textTransform: "uppercase" }}>The easy answer</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 60, position: "relative" }}>
          <LogoNode name="Expo" role="Mobile framework" color="#111111" delay={12} />
          <div style={{ fontFamily: mono, fontSize: 40, color: C.line }}>+</div>
          <LogoNode name="React Native" role="Native UI" color="#149eca" delay={28} />
          <div style={{ fontFamily: mono, fontSize: 40, color: C.line }}>+</div>
          <LogoNode name="Supabase" role="Backend platform" color="#2cba7c" delay={44} />
        </div>
        <div style={{ marginTop: 72, border: `2px dashed ${C.line}`, height: 190, padding: "28px 38px", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: interpolate(frame, [58, 85], [0, 1], clamp) }}>
          <div>
            <div style={{ fontFamily: mono, fontSize: 15, color: C.muted, letterSpacing: "0.14em" }}>EQUIPPED AI WORKSPACE</div>
            <div style={{ marginTop: 18, fontFamily: titleFont, fontWeight: 700, fontSize: 38 }}>What helps the agent build this professionally?</div>
          </div>
          <div style={{ fontFamily: mono, fontSize: 22, color: C.coral, border: `3px solid ${C.coral}`, padding: "18px 28px", transform: `rotate(-4deg) scale(${stamp})`, opacity: stamp }}>MISSING FROM A PLAIN ANSWER</div>
        </div>
      </div>
    </Scene>
  );
};

const BrowserShell = ({ children, agentPanel }: { children: React.ReactNode; agentPanel?: React.ReactNode }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top: 130, bottom: 95, border: `3px solid ${C.ink}`, background: C.panel, boxShadow: `14px 14px 0 ${C.ink}18`, overflow: "hidden" }}>
    <div style={{ height: 52, borderBottom: `2px solid ${C.ink}`, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: C.white }}>
      {[C.coral, C.yellow, C.green].map((color) => <div key={color} style={{ width: 13, height: 13, borderRadius: 99, background: color }} />)}
      <div style={{ marginLeft: 18, flex: 1, height: 30, border: `1px solid ${C.line}`, padding: "6px 14px", fontFamily: mono, fontSize: 12, color: C.muted }}>stack-blueprint.vercel.app</div>
      <div style={{ fontFamily: mono, fontSize: 11, color: C.green, letterSpacing: "0.1em" }}>● AGENT CONNECTED</div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: agentPanel ? "1fr 520px" : "1fr", height: "calc(100% - 52px)" }}>
      <div style={{ position: "relative", overflow: "hidden" }}>{children}</div>
      {agentPanel && <div style={{ borderLeft: `2px solid ${C.ink}`, background: "#0d1f30", color: C.white }}>{agentPanel}</div>}
    </div>
  </div>
);

const WebMcpScene = () => {
  const frame = useCurrentFrame();
  const typing = Math.floor(interpolate(frame, [20, 130], [0, 104], clamp));
  const prompt = "A silly mobile app where roommates photograph the fridge, claim food, and vote on suspicious leftovers";
  const call = spring({ frame: frame - 150, fps: 30, config: { damping: 16, stiffness: 150 }, durationInFrames: 30 });
  return (
    <Scene sheet="SHEET 02 / SHARED PLANNING SURFACE">
      <BrowserShell agentPanel={
        <div style={{ padding: 34 }}>
          <div style={{ fontFamily: mono, fontSize: 13, color: C.cyan, letterSpacing: "0.12em" }}>BROWSER AGENT</div>
          <div style={{ marginTop: 32, border: "1px solid #3b5b72", background: "#142c40", padding: 22, fontFamily: titleFont, fontSize: 24, lineHeight: 1.35 }}>
            Build a blueprint for this project and explain the equipped workspace.
          </div>
          <div style={{ marginTop: 38, transform: `translateY(${(1 - call) * 24}px)`, opacity: call, border: `2px solid ${C.cyan}`, padding: 20 }}>
            <div style={{ fontFamily: mono, fontSize: 12, color: C.cyan, letterSpacing: "0.12em" }}>WEBMCP TOOL CALL</div>
            <div style={{ fontFamily: mono, marginTop: 14, color: C.white, fontSize: 16 }}>build_project_blueprint</div>
            <div style={{ fontFamily: mono, marginTop: 10, color: "#9ab4c6", fontSize: 12 }}>project: &quot;roommate fridge app...&quot;</div>
          </div>
        </div>
      }>
        <div style={{ padding: 48 }}>
          <div style={{ fontFamily: mono, fontSize: 12, color: C.blue, letterSpacing: "0.12em" }}>WHAT ARE YOU BUILDING?</div>
          <div style={{ marginTop: 18, minHeight: 170, border: `2px solid ${C.ink}`, background: C.white, padding: 24, fontFamily: titleFont, fontSize: 31, lineHeight: 1.35 }}>
            {prompt.slice(0, typing)}<span style={{ color: C.blue }}>|</span>
          </div>
          <div style={{ marginTop: 26, display: "inline-block", background: C.blue, color: C.white, padding: "17px 30px", fontFamily: mono, fontSize: 15, letterSpacing: "0.12em" }}>BUILD MY STACK</div>
          <div style={{ marginTop: 52, borderTop: `2px solid ${C.line}`, paddingTop: 28, fontFamily: titleFont, fontSize: 28, color: C.muted }}>
            One description becomes visible shared state for the person and the agent.
          </div>
        </div>
      </BrowserShell>
    </Scene>
  );
};

const BuildScene = () => {
  const frame = useCurrentFrame();
  const steps = [
    ["INFER", "Mobile · Prototype · Speed"],
    ["DISCOVER", "Tool taxonomy V2.4"],
    ["CONSULT", "Maintained tools + Engineering Intel"],
    ["DRAW", "Shared blueprint state"],
  ];
  return (
    <Scene sheet="SHEET 03 / AUTOMATIC CONSULTATION">
      <div style={{ position: "absolute", left: 130, top: 150, right: 130 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
          <div><div style={{ fontFamily: mono, color: C.blue, letterSpacing: "0.14em" }}>BUILD_PROJECT_BLUEPRINT</div><h2 style={{ fontFamily: titleFont, fontSize: 66, margin: "10px 0 0", textTransform: "uppercase" }}>The blueprint draws itself</h2></div>
          <div style={{ fontFamily: mono, color: C.green, fontSize: 15 }}>● LIVE CONSULTATION</div>
        </div>
        <div style={{ marginTop: 70, position: "relative", height: 480 }}>
          <DrawLine x={110} y={235} width={1410} delay={20} />
          {steps.map(([label, value], index) => {
            const enter = spring({ frame: frame - 20 - index * 34, fps: 30, config: { damping: 16, stiffness: 150 }, durationInFrames: 25 });
            return <div key={label} style={{ position: "absolute", left: 30 + index * 410, top: 120, width: 320, transform: `translateY(${(1 - enter) * 30}px)`, opacity: enter }}>
              <div style={{ width: 72, height: 72, borderRadius: 100, background: index === 3 ? C.blue : C.white, border: `3px solid ${C.blue}`, color: index === 3 ? C.white : C.blue, display: "grid", placeItems: "center", fontFamily: mono, fontSize: 22, fontWeight: 800, margin: "0 auto" }}>{String(index + 1).padStart(2, "0")}</div>
              <div style={{ marginTop: 34, border: `2px solid ${C.ink}`, background: C.panel, minHeight: 145, padding: 22, textAlign: "center" }}>
                <div style={{ fontFamily: mono, fontSize: 13, color: C.blue, letterSpacing: "0.12em" }}>{label}</div>
                <div style={{ fontFamily: titleFont, fontSize: 25, fontWeight: 700, lineHeight: 1.2, marginTop: 14 }}>{value}</div>
              </div>
            </div>;
          })}
        </div>
      </div>
    </Scene>
  );
};

const WorkspaceScene = () => {
  const groups = [
    { label: "HARNESS + MODEL", items: [["Codex", "Agent harness", "#111827"], ["GPT-5.6 Sol", "Builder model", "#6941c6"]] },
    { label: "CONNECTED MCPS", items: [["Expo MCP", "Live Expo context", "#111111"], ["Supabase MCP", "Scoped backend access", "#2cba7c"]] },
    { label: "DIAGNOSTICS + QA", items: [["React Doctor", "React diagnostics", "#149eca"], ["Expo Doctor", "Dependency checks", "#111111"], ["agent-device", "Simulator proof", "#ff665c"]] },
    { label: "PROJECT SKILLS", items: [["Expo Skills", "Project · Design · Router", "#0d6bff"], ["Callstack Skills", "React Native production", "#f5a623"], ["NativeWind", "Exact styling setup", "#38bdf8"]] },
  ];
  return (
    <Scene sheet="SHEET A / EQUIPPED AI WORKSPACE">
      <div style={{ position: "absolute", left: 90, right: 90, top: 125 }}>
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", borderBottom: `3px solid ${C.ink}`, paddingBottom: 18 }}>
          <div><div style={{ fontFamily: mono, color: C.blue, letterSpacing: "0.14em" }}>THE HIGH-LEVERAGE LAYER</div><h2 style={{ fontFamily: titleFont, fontSize: 64, margin: "8px 0 0", textTransform: "uppercase" }}>Equipped AI workspace</h2></div>
          <div style={{ fontFamily: mono, color: C.muted, fontSize: 13, textAlign: "right" }}>MATCHED TO<br />EXPO + SUPABASE</div>
        </div>
        <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {groups.map((group, groupIndex) => <div key={group.label} style={{ border: `2px solid ${C.ink}`, background: "rgba(247,251,251,.88)", padding: 22, minHeight: 300 }}>
            <div style={{ fontFamily: mono, fontSize: 13, color: C.muted, letterSpacing: "0.14em", marginBottom: 18 }}>{group.label}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
              {group.items.map(([name, role, color], index) => <LogoNode key={name} name={name} role={role} color={color} compact delay={groupIndex * 24 + index * 11} />)}
            </div>
          </div>)}
        </div>
      </div>
    </Scene>
  );
};

const InspectScene = () => {
  const frame = useCurrentFrame();
  const modal = spring({ frame: frame - 32, fps: 30, config: { damping: 17, stiffness: 140 }, durationInFrames: 30 });
  return (
    <Scene sheet="SHEET 04 / EXPLAINABLE PICKS">
      <BrowserShell>
        <div style={{ padding: 45, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, opacity: 0.38 }}>
          <LogoNode name="Expo MCP" role="Connected MCP" color="#111111" delay={0} />
          <LogoNode name="React Doctor" role="Diagnostic" color="#149eca" delay={4} />
          <LogoNode name="Supabase MCP" role="Connected MCP" color="#2cba7c" delay={8} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(7,28,45,.5)" }} />
        <div style={{ position: "absolute", left: 330, right: 330, top: 80, background: C.paper, border: `3px solid ${C.ink}`, boxShadow: `14px 14px 0 ${C.ink}33`, padding: 42, transform: `translateY(${(1 - modal) * 40}px) scale(${0.96 + 0.04 * modal})`, opacity: modal }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, borderBottom: `2px solid ${C.line}`, paddingBottom: 24 }}>
            <div style={{ width: 70, height: 70, background: "#111", color: C.white, display: "grid", placeItems: "center", fontFamily: titleFont, fontSize: 36, fontWeight: 900 }}>E</div>
            <div><div style={{ fontFamily: mono, color: C.blue, fontSize: 13, letterSpacing: "0.13em" }}>AGENT MCP</div><div style={{ fontFamily: titleFont, fontSize: 46, fontWeight: 800 }}>Expo MCP</div></div>
          </div>
          <div style={{ marginTop: 28, fontFamily: titleFont, fontSize: 27, lineHeight: 1.35 }}>Live Expo, EAS, simulator, and React Native context.</div>
          <div style={{ marginTop: 28, borderLeft: `5px solid ${C.blue}`, paddingLeft: 24 }}>
            <div style={{ fontFamily: mono, color: C.muted, fontSize: 12, letterSpacing: "0.12em" }}>WHY THIS PICK</div>
            <p style={{ fontFamily: titleFont, fontSize: 23, lineHeight: 1.4, margin: "12px 0 0" }}>Search current Expo docs, install SDK-compatible packages, inspect EAS builds, and capture simulator screenshots instead of guessing from stale model memory.</p>
          </div>
          <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 13 }}><span style={{ color: C.green }}>✓ OFFICIAL SOURCE</span><span style={{ color: C.blue }}>docs.expo.dev/mcp ↗</span></div>
        </div>
      </BrowserShell>
    </Scene>
  );
};

const IntelScene = () => {
  const frame = useCurrentFrame();
  const items = [
    ["01", "Define acceptance criteria before implementation.", "Harness Engineering Guide"],
    ["02", "Use a fresh evaluator instead of letting the builder grade itself.", "Coding agent evaluation research"],
    ["03", "Keep repository context explicit and require user-visible proof.", "Current agentic engineering Intel"],
  ];
  return (
    <Scene sheet="SHEET 05 / VIBE INTEL">
      <div style={{ position: "absolute", left: 145, top: 155, right: 145 }}>
        <div style={{ fontFamily: mono, color: C.blue, letterSpacing: "0.14em" }}>PROJECT-SPECIFIC EXECUTION PLAYBOOK</div>
        <h2 style={{ fontFamily: titleFont, fontSize: 68, margin: "10px 0 20px", textTransform: "uppercase" }}>Evidence becomes instructions</h2>
        <p style={{ fontFamily: titleFont, fontSize: 27, color: C.muted, margin: 0, maxWidth: 1200 }}>The page discards unrelated news and rewrites retained engineering evidence as actions the coding agent can perform.</p>
        <div style={{ marginTop: 50, display: "grid", gap: 18 }}>
          {items.map(([number, instruction, source], index) => {
            const enter = spring({ frame: frame - 18 - index * 28, fps: 30, config: { damping: 17, stiffness: 150 }, durationInFrames: 28 });
            return <div key={number} style={{ display: "grid", gridTemplateColumns: "105px 1fr 360px", alignItems: "center", border: `2px solid ${C.ink}`, background: C.panel, minHeight: 145, opacity: enter, transform: `translateX(${(1 - enter) * 36}px)` }}>
              <div style={{ alignSelf: "stretch", display: "grid", placeItems: "center", background: index === 0 ? C.blue : C.ink, color: C.white, fontFamily: mono, fontSize: 23 }}>{number}</div>
              <div style={{ padding: "24px 30px", fontFamily: titleFont, fontSize: 30, fontWeight: 700 }}>{instruction}</div>
              <div style={{ alignSelf: "stretch", borderLeft: `1px solid ${C.line}`, padding: "30px 26px", fontFamily: mono, fontSize: 12, color: C.muted, lineHeight: 1.6 }}><span style={{ color: C.green }}>CITED</span><br />{source}</div>
            </div>;
          })}
        </div>
      </div>
    </Scene>
  );
};

const CollaborationScene = () => {
  const frame = useCurrentFrame();
  const shared = spring({ frame: frame - 25, fps: 30, config: { damping: 16, stiffness: 135 }, durationInFrames: 34 });
  return (
    <Scene sheet="SHEET 06 / HUMAN + AGENT">
      <div style={{ position: "absolute", left: 120, top: 145, right: 120 }}>
        <div style={{ textAlign: "center" }}><div style={{ fontFamily: mono, color: C.blue, letterSpacing: "0.14em" }}>ONE SHARED OBJECT</div><h2 style={{ fontFamily: titleFont, fontSize: 68, margin: "10px 0 50px", textTransform: "uppercase" }}>The page is the plan</h2></div>
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr 360px", gap: 70, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}><div style={{ width: 138, height: 138, borderRadius: 100, background: C.yellow, border: `3px solid ${C.ink}`, display: "grid", placeItems: "center", margin: "0 auto", fontFamily: titleFont, fontSize: 56, fontWeight: 900 }}>U</div><div style={{ fontFamily: titleFont, fontSize: 34, fontWeight: 800, marginTop: 18 }}>Person</div><div style={{ fontFamily: mono, fontSize: 13, color: C.muted, marginTop: 8 }}>CLICKS · QUESTIONS · UNDERSTANDS</div></div>
          <div style={{ transform: `scale(${0.92 + shared * 0.08})`, opacity: shared, border: `3px solid ${C.ink}`, background: C.panel, boxShadow: `12px 12px 0 ${C.ink}1d`, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 12, color: C.muted, borderBottom: `2px solid ${C.line}`, paddingBottom: 15 }}><span>FINAL BUILD BRIEF</span><span>REV 01</span></div>
            <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {["Selected stack", "Equipped workspace", "Cited evidence", "Build order"].map((text, index) => <div key={text} style={{ border: `1px solid ${C.line}`, background: index === 1 ? "#e3f0ff" : C.white, padding: 18, fontFamily: titleFont, fontSize: 23, fontWeight: 700 }}><span style={{ color: C.green }}>✓</span> {text}</div>)}
            </div>
            <div style={{ marginTop: 18, background: C.blue, color: C.white, padding: 15, textAlign: "center", fontFamily: mono, fontSize: 13, letterSpacing: "0.12em" }}>COPY BUILD BRIEF</div>
          </div>
          <div style={{ textAlign: "center" }}><div style={{ width: 138, height: 138, borderRadius: 100, background: C.cyan, border: `3px solid ${C.ink}`, display: "grid", placeItems: "center", margin: "0 auto", fontFamily: titleFont, fontSize: 56, fontWeight: 900 }}>A</div><div style={{ fontFamily: titleFont, fontSize: 34, fontWeight: 800, marginTop: 18 }}>Agent</div><div style={{ fontFamily: mono, fontSize: 13, color: C.muted, marginTop: 8 }}>INSPECTS · REFINES · RENDERS</div></div>
        </div>
        <DrawLine x={438} y={380} width={155} delay={15} />
        <DrawLine x={1080} y={380} width={155} delay={28} />
      </div>
    </Scene>
  );
};

const OutroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, durationInFrames: 40 });
  return (
    <Scene sheet="SHEET 07 / READY TO BUILD">
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div style={{ transform: `scale(${0.92 + enter * 0.08})`, opacity: enter }}>
          <div style={{ fontFamily: mono, color: C.blue, fontSize: 17, letterSpacing: "0.18em" }}>STACK BLUEPRINT</div>
          <h2 style={{ fontFamily: titleFont, fontSize: 96, lineHeight: 0.95, textTransform: "uppercase", margin: "22px auto 30px", maxWidth: 1300 }}>Equip the agent.<br /><span style={{ color: C.blue }}>Then build.</span></h2>
          <div style={{ width: 720, height: 3, background: C.ink, margin: "0 auto 28px" }} />
          <div style={{ fontFamily: titleFont, fontSize: 32 }}>stack-blueprint.vercel.app</div>
          <div style={{ marginTop: 20, fontFamily: mono, fontSize: 14, color: C.muted, letterSpacing: "0.13em" }}>LIVE WEBMCP TOOL · PUBLIC SOURCE · EXPLAINABLE PICKS</div>
        </div>
      </div>
    </Scene>
  );
};

const CaptionLayer = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = (frame / fps) * 1000;
  const caption = captions.find((item) => item.startMs <= now && item.endMs > now);
  if (!caption) return null;
  const fade = Math.min(1, (now - caption.startMs) / 140, (caption.endMs - now) / 140);
  return (
    <div style={{ position: "absolute", left: 250, right: 250, bottom: 34, display: "flex", justifyContent: "center", opacity: fade, zIndex: 50 }}>
      <div style={{ background: "rgba(7,28,45,.94)", color: C.white, border: "1px solid rgba(255,255,255,.2)", padding: "13px 22px", fontFamily: titleFont, fontSize: 25, lineHeight: 1.2, textAlign: "center", boxShadow: "0 6px 18px rgba(7,28,45,.18)" }}>{caption.text}</div>
    </div>
  );
};

const S = (seconds: number) => Math.round(seconds * 30);

export const StackBlueprintDemo = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Audio src={staticFile("voiceover.m4a")} />
    <Sequence from={S(0)} durationInFrames={S(13.4)} premountFor={S(1)}><IntroScene /></Sequence>
    <Sequence from={S(13.4)} durationInFrames={S(14.7)} premountFor={S(1)}><ProblemScene /></Sequence>
    <Sequence from={S(28.1)} durationInFrames={S(16.7)} premountFor={S(1)}><WebMcpScene /></Sequence>
    <Sequence from={S(44.8)} durationInFrames={S(17)} premountFor={S(1)}><BuildScene /></Sequence>
    <Sequence from={S(61.8)} durationInFrames={S(29.5)} premountFor={S(1)}><WorkspaceScene /></Sequence>
    <Sequence from={S(91.3)} durationInFrames={S(15.7)} premountFor={S(1)}><InspectScene /></Sequence>
    <Sequence from={S(107)} durationInFrames={S(25)} premountFor={S(1)}><IntelScene /></Sequence>
    <Sequence from={S(132)} durationInFrames={S(22)} premountFor={S(1)}><CollaborationScene /></Sequence>
    <Sequence from={S(154)} durationInFrames={S(7)} premountFor={S(1)}><OutroScene /></Sequence>
    <CaptionLayer />
  </AbsoluteFill>
);
