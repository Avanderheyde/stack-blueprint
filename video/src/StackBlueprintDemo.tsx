import type {Caption} from "@remotion/captions";
import {Audio} from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
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
  cyan: "#55d7f3",
  paper: "#edf6f5",
  panel: "#f8fbfa",
  white: "#fffef8",
  line: "#86aab6",
  muted: "#587586",
  green: "#40c790",
  yellow: "#f7d651",
  coral: "#ef695d",
  cream: "#f5efe2",
};

const display = '"Avenir Next Condensed", "DIN Condensed", sans-serif';
const body = '"Avenir Next", "Helvetica Neue", sans-serif';
const mono = '"SFMono-Regular", Menlo, monospace';
const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const S = (seconds: number) => Math.round(seconds * 30);

const BlueprintBackground = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.paper,
      backgroundImage:
        "linear-gradient(rgba(13,107,255,.085) 1px,transparent 1px),linear-gradient(90deg,rgba(13,107,255,.085) 1px,transparent 1px),linear-gradient(rgba(13,107,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(13,107,255,.03) 1px,transparent 1px)",
      backgroundSize: "80px 80px,80px 80px,16px 16px,16px 16px",
    }}
  />
);

const CornerMarks = () => (
  <>
    {[[38, 38], [1842, 38], [38, 1002], [1842, 1002]].map(([left, top], index) => (
      <div key={index} style={{position: "absolute", left, top, width: 40, height: 40}}>
        <div style={{position: "absolute", left: 0, top: 19, width: 40, height: 2, background: C.blue, opacity: .34}} />
        <div style={{position: "absolute", left: 19, top: 0, width: 2, height: 40, background: C.blue, opacity: .34}} />
      </div>
    ))}
  </>
);

const Scene = ({sheet, children}: {sheet: string; children: React.ReactNode}) => (
  <AbsoluteFill style={{color: C.ink, overflow: "hidden"}}>
    <BlueprintBackground />
    <CornerMarks />
    <div style={{position: "absolute", left: 68, top: 54, display: "flex", gap: 18, alignItems: "center", fontFamily: mono}}>
      <span style={{fontSize: 19, fontWeight: 800, letterSpacing: ".16em"}}>STACK BLUEPRINT</span>
      <span style={{width: 1, height: 20, background: C.line}} />
      <span style={{fontSize: 13, letterSpacing: ".12em", color: C.muted}}>{sheet}</span>
    </div>
    {children}
  </AbsoluteFill>
);

const enter = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, durationInFrames: Math.round(.7 * fps), config: {damping: 18, stiffness: 115, mass: .8}});

const TitleScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = enter(frame, fps, 2);
  const rule = interpolate(frame, [8, 27], [0, 1], clamp);
  return <Scene sheet="SHEET 01 / TITLE">
    <div style={{position: "absolute", left: 155, right: 155, top: 250, opacity: title, transform: `translateY(${(1 - title) * 24}px)`}}>
      <div style={{font: `13px ${mono}`, color: C.blue, letterSpacing: ".16em"}}>STACK BLUEPRINT · PROJECT NO. 01</div>
      <h1 style={{margin: "25px 0 0", font: `800 145px/.94 ${display}`, textTransform: "uppercase", letterSpacing: "-.025em"}}>Equip the agent.<br /><span style={{color: C.blue}}>Then build.</span></h1>
      <div style={{height: 3, background: C.ink, margin: "42px 0 27px", transform: `scaleX(${rule})`, transformOrigin: "left"}} />
      <p style={{margin: 0, maxWidth: 1180, font: `30px/1.35 ${body}`, color: C.muted}}>One software idea becomes a product stack and the AI workspace needed to execute it well.</p>
    </div>
  </Scene>;
};

const BrowserShell = ({children, agent}: {children: React.ReactNode; agent?: React.ReactNode}) => (
  <div style={{position: "absolute", left: 82, right: 82, top: 126, bottom: 92, background: C.panel, border: `3px solid ${C.ink}`, boxShadow: "14px 14px 0 rgba(11,40,65,.09)", overflow: "hidden"}}>
    <div style={{height: 50, borderBottom: `2px solid ${C.ink}`, background: C.white, display: "flex", alignItems: "center", gap: 9, padding: "0 20px"}}>
      {[C.coral, C.yellow, C.green].map((color) => <span key={color} style={{width: 12, height: 12, borderRadius: 99, background: color}} />)}
      <div style={{height: 29, flex: 1, marginLeft: 14, border: `1px solid ${C.line}`, padding: "6px 13px", font: `12px ${mono}`, color: C.muted}}>stack-blueprint.vercel.app</div>
      <span style={{font: `11px ${mono}`, letterSpacing: ".1em", color: C.green}}>● AGENT CONNECTED</span>
    </div>
    <div style={{height: "calc(100% - 50px)", display: "grid", gridTemplateColumns: agent ? "1fr 500px" : "1fr"}}>
      <div style={{position: "relative", overflow: "hidden"}}>{children}</div>
      {agent ? <div style={{borderLeft: `2px solid ${C.ink}`, background: "#0d2335", color: C.white}}>{agent}</div> : null}
    </div>
  </div>
);

const PromptScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = enter(frame, fps, 4);
  const fullPrompt = "A mobile app where roommates photograph food, claim what is theirs, and vote on suspicious leftovers.";
  const typed = Math.floor(interpolate(frame, [S(5.5), S(15)], [0, fullPrompt.length], clamp));
  const firstBeat = frame < S(5.4);
  return (
    <Scene sheet="SHEET 01 / PROJECT BRIEF">
      <BrowserShell>
        <div style={{padding: "54px 70px"}}>
          <div style={{font: `13px ${mono}`, color: C.blue, letterSpacing: ".14em"}}>WHAT ARE YOU BUILDING?</div>
          <h1 style={{margin: "12px 0 28px", fontFamily: display, fontSize: 66, lineHeight: .98, textTransform: "uppercase", transform: `translateY(${(1 - title) * 22}px)`, opacity: title}}>
            One idea. Two plans.
          </h1>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 28}}>
            {["PRODUCT SOFTWARE", "EQUIPPED AI WORKSPACE"].map((label, index) => (
              <div key={label} style={{borderTop: `3px solid ${index ? C.blue : C.ink}`, padding: "14px 0", font: `14px ${mono}`, letterSpacing: ".11em", color: index ? C.blue : C.ink}}>{String(index + 1).padStart(2, "0")} · {label}</div>
            ))}
          </div>
          <div style={{height: 190, border: `2px solid ${C.ink}`, background: C.white, padding: "24px 28px", fontFamily: body, fontSize: 31, lineHeight: 1.34, color: firstBeat ? C.muted : C.ink}}>
            {firstBeat ? "Describe the product in ordinary language…" : fullPrompt.slice(0, typed)}
            {!firstBeat && typed < fullPrompt.length ? <span style={{color: C.blue}}>|</span> : null}
          </div>
          <div style={{marginTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{background: C.blue, color: C.white, padding: "15px 28px", font: `13px ${mono}`, letterSpacing: ".12em"}}>BUILD MY BLUEPRINT</div>
            <div style={{font: `13px ${mono}`, color: C.muted}}>NO QUESTIONNAIRE · ONE SHARED BRIEF</div>
          </div>
        </div>
      </BrowserShell>
    </Scene>
  );
};

const LogoNode = ({name, role, color, delay = 0, small = false}: {name: string; role: string; color: string; delay?: number; small?: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enter(frame, fps, delay);
  return (
    <div style={{display: "flex", alignItems: "center", gap: small ? 11 : 17, padding: small ? "11px 14px" : "18px 20px", border: `2px solid ${C.ink}`, background: C.panel, minWidth: small ? 205 : 280, transform: `translateY(${(1 - p) * 20}px)`, opacity: p}}>
      <div style={{width: small ? 38 : 52, height: small ? 38 : 52, background: color, color: C.white, display: "grid", placeItems: "center", font: `800 ${small ? 21 : 28}px ${display}`}}>{name[0]}</div>
      <div><div style={{font: `700 ${small ? 20 : 27}px ${display}`}}>{name}</div><div style={{font: `${small ? 9 : 11}px ${mono}`, color: C.muted, letterSpacing: ".09em", textTransform: "uppercase"}}>{role}</div></div>
    </div>
  );
};

const StackOnlyScene = () => {
  const frame = useCurrentFrame();
  const stamp = enter(frame, 30, 100);
  return (
    <Scene sheet="SHEET 02 / SOFTWARE STACK">
      <div style={{position: "absolute", left: 120, right: 120, top: 155}}>
        <div style={{font: `14px ${mono}`, color: C.muted, letterSpacing: ".14em"}}>A NORMAL AGENT ANSWER</div>
        <h2 style={{font: `800 76px ${display}`, textTransform: "uppercase", margin: "8px 0 54px"}}>Reasonable ingredients</h2>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 44}}>
          <LogoNode name="Expo" role="mobile framework" color="#17202b" delay={10} />
          <span style={{font: `40px ${mono}`, color: C.line}}>+</span>
          <LogoNode name="React Native" role="native UI" color="#159fca" delay={24} />
          <span style={{font: `40px ${mono}`, color: C.line}}>+</span>
          <LogoNode name="Supabase" role="backend platform" color="#31b779" delay={38} />
        </div>
        <div style={{height: 205, marginTop: 60, border: `2px dashed ${C.line}`, padding: "30px 40px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div><div style={{font: `13px ${mono}`, color: C.muted, letterSpacing: ".13em"}}>STILL UNANSWERED</div><div style={{marginTop: 14, font: `700 38px ${display}`}}>How should the agent use this stack well?</div></div>
          <div style={{border: `3px solid ${C.coral}`, color: C.coral, padding: "17px 24px", font: `700 18px ${mono}`, transform: `rotate(-3deg) scale(${stamp})`, opacity: stamp}}>WORKSPACE MISSING</div>
        </div>
      </div>
    </Scene>
  );
};

const WebMcpScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const switched = frame >= S(5.5);
  const call = enter(frame, fps, S(5.6));
  const pan = interpolate(frame, [S(6.2), S(11.3)], [0, -1040], clamp);
  return (
    <Scene sheet="SHEET 03 / LIVE WEBMCP HANDOFF">
      <div style={{position: "absolute", left: 82, right: 82, top: 126, bottom: 88, border: `3px solid ${C.ink}`, background: C.white, overflow: "hidden", boxShadow: "14px 14px 0 rgba(11,40,65,.09)"}}>
        <Img src={staticFile(switched ? "live-webmcp-build-full.png" : "live-webmcp-before.png")} style={{width: "100%", height: switched ? "auto" : "100%", objectFit: switched ? undefined : "cover", objectPosition: "top", transform: switched ? `translateY(${pan}px)` : "none"}} />
        <div style={{position: "absolute", left: 18, top: 18, padding: "10px 14px", background: C.green, color: C.white, font: `11px ${mono}`, letterSpacing: ".11em"}}>LIVE CAPTURE · CODEX IN-APP BROWSER</div>
        <div style={{position: "absolute", right: 22, top: 22, width: 480, border: `2px solid ${C.cyan}`, background: "rgba(13,35,53,.97)", color: C.white, padding: 20, opacity: call, transform: `translateY(${(1 - call) * 18}px)`}}>
          <div style={{font: `10px ${mono}`, color: C.cyan, letterSpacing: ".12em"}}>DISCOVERED PAGE TOOL · CALLED LIVE</div>
          <div style={{marginTop: 10, font: `16px ${mono}`}}>build_project_blueprint</div>
          <div style={{marginTop: 10, color: "#b6cbd7", font: `11px/1.5 ${mono}`}}>RESULT · REV 01 · 26 PICKS<br />CATALOG MATCHES VERIFIED ON THE DRAWING</div>
        </div>
      </div>
    </Scene>
  );
};

const ResearchScene = () => {
  const frame = useCurrentFrame();
  const steps = [
    ["UNDERSTAND", "Mobile · photos · accounts"],
    ["CHECK", "VibeLeaderboard tools + Intel"],
    ["FILTER", "Maintained tools + relevant Intel"],
    ["DRAW", "One shared blueprint"],
  ];
  return (
    <Scene sheet="SHEET 04 / LIVE CONSULTATION">
      <div style={{position: "absolute", left: 120, right: 120, top: 155}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "end"}}><div><div style={{font: `13px ${mono}`, color: C.blue, letterSpacing: ".13em"}}>AUTOMATIC CONSULTATION</div><h2 style={{font: `800 68px ${display}`, textTransform: "uppercase", margin: "8px 0"}}>The blueprint draws itself</h2></div><div style={{font: `13px ${mono}`, color: C.green}}>● CURRENT CATALOG CONNECTED</div></div>
        <div style={{position: "relative", marginTop: 75, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28}}>
          <div style={{position: "absolute", left: 100, right: 100, top: 45, height: 3, background: C.line}} />
          {steps.map(([label, value], index) => {
            const p = enter(frame, 30, index * 28);
            return <div key={label} style={{position: "relative", opacity: p, transform: `translateY(${(1 - p) * 22}px)`}}>
              <div style={{width: 90, height: 90, margin: "0 auto", borderRadius: 99, border: `3px solid ${C.blue}`, background: index === 3 ? C.blue : C.white, color: index === 3 ? C.white : C.blue, display: "grid", placeItems: "center", font: `700 21px ${mono}`}}>{String(index + 1).padStart(2, "0")}</div>
              <div style={{marginTop: 28, minHeight: 160, border: `2px solid ${C.ink}`, background: C.panel, padding: "22px 18px", textAlign: "center"}}><div style={{font: `12px ${mono}`, color: C.blue, letterSpacing: ".11em"}}>{label}</div><div style={{marginTop: 14, font: `700 24px/1.18 ${display}`}}>{value}</div></div>
            </div>;
          })}
        </div>
      </div>
    </Scene>
  );
};

const WorkspaceScene = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const matches = [
    {stack: "EXPO", role: "MOBILE FRAMEWORK", color: "#17202b", start: 3.2, tools: ["Expo MCP", "Expo Doctor", "agent-device", "Expo project + UI skills"]},
    {stack: "REACT NATIVE", role: "NATIVE UI", color: "#159fca", start: 14.2, tools: ["Callstack skills", "React Doctor"]},
    {stack: "NATIVEWIND", role: "STYLING", color: "#28a9d6", start: 18.4, tools: ["Expo Tailwind setup skill"]},
    {stack: "SUPABASE", role: "BACKEND PLATFORM", color: "#31b779", start: 21.3, tools: ["Supabase MCP", "Database skill", "Postgres best practices"]},
  ];
  const proof = enter(frame, fps, S(27));
  return (
    <Scene sheet="SHEET 05 / MATCHED AI WORKSPACE">
      <div style={{position: "absolute", left: 84, right: 84, top: 128}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "end", borderBottom: `3px solid ${C.ink}`, paddingBottom: 13}}><div><div style={{font: `12px ${mono}`, color: C.blue, letterSpacing: ".13em"}}>THE SOFTWARE STACK DETERMINES THE AI WORKSPACE</div><h2 style={{font: `800 55px ${display}`, textTransform: "uppercase", margin: "5px 0 0"}}>Each pick unlocks its tools</h2></div><div style={{font: `11px/1.6 ${mono}`, color: C.muted, textAlign: "right"}}>MCPs · SKILLS · CLIs<br />DIAGNOSTICS · TESTING</div></div>
        <div style={{display: "grid", gap: 11, marginTop: 18}}>
          {matches.map((match, index) => {
            const p = enter(frame, fps, S(match.start));
            const nextStart = matches[index + 1]?.start ?? 27;
            const active = frame / fps >= match.start && frame / fps < nextStart;
            return <div key={match.stack} style={{display: "grid", gridTemplateColumns: "290px 46px 1fr", alignItems: "center", minHeight: 116, border: `2px solid ${active ? C.blue : C.ink}`, background: active ? "#e5efff" : "rgba(248,251,250,.93)", opacity: p, transform: `translateX(${(1 - p) * -24}px)`}}>
              <div style={{height: "100%", padding: "17px 20px", display: "flex", alignItems: "center", gap: 15, borderRight: `2px solid ${active ? C.blue : C.ink}`}}><div style={{width: 50, height: 50, background: match.color, color: C.white, display: "grid", placeItems: "center", font: `800 25px ${display}`}}>{match.stack[0]}</div><div><div style={{font: `800 25px ${display}`}}>{match.stack}</div><div style={{font: `9px ${mono}`, color: C.muted, letterSpacing: ".1em"}}>{match.role}</div></div></div>
              <div style={{font: `800 27px ${mono}`, color: active ? C.blue : C.line, textAlign: "center"}}>→</div>
              <div style={{display: "flex", flexWrap: "wrap", gap: 9, padding: "16px 18px"}}>{match.tools.map((tool) => <span key={tool} style={{padding: "10px 13px", border: `1px solid ${active ? C.blue : C.line}`, background: C.white, color: active ? C.blue : C.ink, font: `12px ${mono}`}}>{tool}</span>)}</div>
            </div>;
          })}
        </div>
        <div style={{marginTop: 14, display: "flex", justifyContent: "center", gap: 12, opacity: proof, transform: `translateY(${(1 - proof) * 18}px)`}}>{["CURRENT DOCUMENTATION", "STACK-SPECIFIC PATTERNS", "DIAGNOSTICS", "RUNNING-APP PROOF"].map((item, index) => <span key={item} style={{padding: "10px 14px", background: index === 3 ? C.green : C.ink, color: C.white, font: `10px ${mono}`, letterSpacing: ".06em"}}>{item}</span>)}</div>
      </div>
    </Scene>
  );
};

const CapabilitiesScene = () => {
  const frame = useCurrentFrame();
  const capabilities = [
    ["CURRENT DOCUMENTATION", "Expo MCP · Supabase MCP"],
    ["PROJECT CONTEXT", "Project skills · Vibe Intel"],
    ["STACK-SPECIFIC PATTERNS", "Expo · Callstack · Postgres"],
    ["DIAGNOSTICS", "React Doctor · Expo Doctor"],
    ["RUNNING-APP PROOF", "agent-device · simulator"],
  ];
  return <Scene sheet="SHEET 05B / WHAT THE AGENT GAINS">
    <div style={{position: "absolute", left: 115, right: 115, top: 145}}>
      <div style={{font: `12px ${mono}`, color: C.blue, letterSpacing: ".13em"}}>THE EQUIPPED WORKSPACE, IN PLAIN LANGUAGE</div>
      <h2 style={{font: `800 68px ${display}`, textTransform: "uppercase", margin: "8px 0 48px"}}>What these tools give the coding agent</h2>
      <div style={{display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 15}}>{capabilities.map(([label, tools], index) => { const p = enter(frame, 30, index * 10); return <div key={label} style={{minHeight: 410, border: `2px solid ${C.ink}`, background: C.panel, padding: "25px 21px", opacity: p, transform: `translateY(${(1 - p) * 22}px)`, display: "grid", alignContent: "space-between"}}><div><div style={{width: 46, height: 46, display: "grid", placeItems: "center", background: index === 4 ? C.green : C.blue, color: C.white, font: `15px ${mono}`}}>{String(index + 1).padStart(2, "0")}</div><div style={{marginTop: 25, font: `800 31px/1.05 ${display}`}}>{label}</div></div><div style={{paddingTop: 13, borderTop: `1px solid ${C.line}`, font: `10px/1.65 ${mono}`, color: C.muted, letterSpacing: ".06em"}}>{tools}</div></div>;})}</div>
      <div style={{marginTop: 26, display: "flex", justifyContent: "space-between", borderTop: `2px solid ${C.ink}`, paddingTop: 16, font: `10px ${mono}`, letterSpacing: ".1em"}}><span>MOBILE · PROTOTYPE · 2 PRODUCTION TOOLS DEFERRED</span><span style={{color: C.green}}>BLUEPRINT READY · CLICK ANY LOGO TO SEE WHY</span></div>
    </div>
  </Scene>;
};

const Phone = ({equipped}: {equipped: boolean}) => (
  <div style={{width: 345, height: 650, borderRadius: 46, border: equipped ? "8px solid #162a25" : "8px solid #24233b", background: equipped ? "#f4f0e5" : "linear-gradient(145deg,#faf5ff,#edf2ff)", overflow: "hidden", boxShadow: "0 22px 45px rgba(16,36,52,.18)", fontFamily: body}}>
    <div style={{height: 34, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", fontSize: 10, color: equipped ? "#203b34" : "#56516d"}}><span>9:41</span><span>● ● ●</span></div>
    {equipped ? <>
      <div style={{padding: "10px 20px 14px", borderBottom: "1px solid #c8c1af", display: "flex", justifyContent: "space-between", alignItems: "end"}}><div><div style={{font: `11px ${mono}`, color: "#5d786d"}}>APT 4B · SHARED FRIDGE</div><div style={{font: `800 30px ${display}`, color: "#162a25"}}>Shelf Check</div></div><div style={{width: 42, height: 42, borderRadius: 99, background: "#ef6b4f", color: C.white, display: "grid", placeItems: "center", fontSize: 22}}>＋</div></div>
      <div style={{padding: "15px 18px"}}>
        <div style={{display: "flex", gap: 7, marginBottom: 14}}>{["ALL 12", "MINE 3", "UNCLAIMED 2"].map((x, i) => <span key={x} style={{padding: "7px 10px", background: i === 0 ? "#203b34" : "transparent", color: i === 0 ? "#f8f4e8" : "#536f65", border: "1px solid #8ba297", borderRadius: 99, font: `9px ${mono}`}}>{x}</span>)}</div>
        <div style={{background: "#e1e8d7", border: "1px solid #99ad91", padding: 12}}><div style={{height: 122, background: "#b9c7a9", display: "grid", placeItems: "center", fontSize: 48}}>🥡</div><div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 11}}><div><b style={{fontSize: 16, color: "#203b34"}}>Thai leftovers</b><div style={{fontSize: 11, color: "#5d786d", marginTop: 3}}>Claimed by Maya · yesterday</div></div><span style={{background: "#f4c451", color: "#4b3b13", padding: "5px 7px", font: `8px ${mono}`}}>CHECK TODAY</span></div></div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10}}>{[["🥛","Oat milk","Jon"],["🫐","Blueberries","Unclaimed"]].map(([emoji,title,owner]) => <div key={title} style={{border: "1px solid #b8b09d", background: "#faf7ee", padding: 9}}><div style={{height: 72, background: "#ebe4d4", display: "grid", placeItems: "center", fontSize: 30}}>{emoji}</div><b style={{display: "block", marginTop: 7, fontSize: 13, color: "#203b34"}}>{title}</b><span style={{fontSize: 9, color: "#6b7f76"}}>{owner}</span></div>)}</div>
        <div style={{marginTop: 13, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8}}><button style={{border: "1px solid #203b34", background: "transparent", color: "#203b34", padding: 10, fontWeight: 700}}>Flag leftover</button><button style={{border: 0, background: "#203b34", color: "#f8f4e8", padding: 10, fontWeight: 700}}>Add a photo</button></div>
      </div>
      <div style={{height: 45, borderTop: "1px solid #c8c1af", display: "flex", justifyContent: "space-around", alignItems: "center", fontSize: 11, color: "#48645a"}}><b>Fridge</b><span>Votes</span><span>Roommates</span></div>
    </> : <>
      <div style={{padding: "19px 20px", textAlign: "center"}}><span style={{display: "inline-block", padding: "6px 12px", borderRadius: 99, background: "#ede5ff", color: "#7a45cc", fontSize: 10}}>✨ AI-POWERED FOOD SHARING</span><div style={{fontSize: 31, fontWeight: 800, marginTop: 13, background: "linear-gradient(90deg,#7b4dff,#3f8cff)", WebkitBackgroundClip: "text", color: "transparent"}}>Smart Fridge Hub</div><p style={{fontSize: 12, color: "#716d84", lineHeight: 1.45}}>Organize. Share. Connect. Make roommate life effortless.</p></div>
      <div style={{padding: "0 17px", display: "grid", gap: 12}}>{[["📸","Snap & Share","Upload food instantly"],["🤝","Claim Items","Stay organized together"],["⚡","Smart Voting","Decide with AI"]].map(([emoji,title,desc], i) => <div key={title} style={{borderRadius: 22, padding: 15, background: C.white, boxShadow: "0 8px 22px rgba(89,75,140,.10)", display: "flex", gap: 13, alignItems: "center", border: `1px solid ${i === 1 ? "#dac8ff" : "#e4e1eb"}`}}><div style={{width: 48, height: 48, borderRadius: 16, display: "grid", placeItems: "center", background: i === 0 ? "#e9e2ff" : i === 1 ? "#e1f2ff" : "#fff0d9", fontSize: 24}}>{emoji}</div><div><b style={{fontSize: 15, color: "#343149"}}>{title}</b><div style={{fontSize: 10, color: "#8a8699", marginTop: 4}}>{desc}</div></div></div>)}</div>
      <button style={{display: "block", width: "calc(100% - 34px)", margin: "20px 17px", border: 0, borderRadius: 16, padding: 14, color: "white", fontWeight: 800, background: "linear-gradient(90deg,#7b4dff,#438cf7)", boxShadow: "0 10px 24px rgba(83,91,227,.25)"}}>Get Started ✨</button>
      <div style={{textAlign: "center", color: "#9b97aa", fontSize: 9}}>Powered by AI · Secure · Seamless</div>
    </>}
  </div>
);

const ComparisonScene = () => {
  const frame = useCurrentFrame();
  const tools = interpolate(frame, [S(10), S(15)], [0, 1], clamp);
  return (
    <Scene sheet="SHEET 06 / ILLUSTRATIVE BUILD COMPARISON">
      <div style={{position: "absolute", left: 80, right: 80, top: 124}}>
        <div style={{display: "grid", gridTemplateColumns: "1fr 240px 1fr", gap: 24, alignItems: "start"}}>
          <div style={{textAlign: "center"}}><div style={{font: `12px ${mono}`, color: C.coral, letterSpacing: ".12em"}}>PLAIN AGENT · STACK ONLY</div><div style={{font: `700 28px ${display}`, margin: "7px 0 14px"}}>Generic output</div><div style={{display: "grid", placeItems: "center"}}><Phone equipped={false} /></div></div>
          <div style={{paddingTop: 180, textAlign: "center"}}><div style={{font: `11px ${mono}`, color: C.muted}}>SAME IDEA<br />SAME AGENT</div><div style={{font: `800 64px ${display}`, color: C.blue, margin: "18px 0"}}>→</div><div style={{display: "grid", gap: 8, opacity: tools, transform: `translateX(${(1 - tools) * -24}px)`}}>{["EXPO UI SKILLS", "CALLSTACK RN", "REACT DOCTOR", "SIMULATOR PROOF"].map((x, i) => <span key={x} style={{padding: "8px 7px", background: i < 2 ? "#e1eeff" : "#dff4e9", border: `1px solid ${i < 2 ? "#8db8f0" : "#8dc6a9"}`, font: `9px ${mono}`}}>{x}</span>)}</div></div>
          <div style={{textAlign: "center"}}><div style={{font: `12px ${mono}`, color: C.green, letterSpacing: ".12em"}}>EQUIPPED AGENT · STACK BLUEPRINT</div><div style={{font: `700 28px ${display}`, margin: "7px 0 14px"}}>Product-specific output</div><div style={{display: "grid", placeItems: "center"}}><Phone equipped /></div></div>
        </div>
        <div style={{position: "absolute", left: 0, bottom: -52, font: `10px ${mono}`, color: C.muted}}>ILLUSTRATIVE COMPARISON · SAME FEATURE BRIEF</div>
      </div>
    </Scene>
  );
};

const IntelScene = () => {
  const frame = useCurrentFrame();
  const items = [
    ["01", "Define success before coding.", "Harness engineering"],
    ["02", "Keep project context clear.", "Agent workflow guidance"],
    ["03", "Use an independent review pass.", "Evaluation practice"],
    ["04", "Require proof from the running app.", "Verification guidance"],
  ];
  return (
    <Scene sheet="SHEET 09 / PROJECT-SPECIFIC INTEL">
      <div style={{position: "absolute", left: 130, right: 130, top: 142}}>
        <div style={{font: `12px ${mono}`, color: C.blue, letterSpacing: ".13em"}}>CURRENT ADVICE, FILTERED FOR THIS BUILD</div><h2 style={{font: `800 68px ${display}`, textTransform: "uppercase", margin: "9px 0 14px"}}>Intel becomes instructions</h2><p style={{margin: 0, font: `25px/1.35 ${body}`, color: C.muted}}>Unrelated material drops away. The retained evidence becomes actions the agent can follow.</p>
        <div style={{marginTop: 38, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>{items.map(([num, instruction, source], i) => {const p = enter(frame, 30, i * 20); return <div key={num} style={{display: "grid", gridTemplateColumns: "74px 1fr", minHeight: 142, border: `2px solid ${C.ink}`, background: C.panel, opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}><div style={{background: i === 0 ? C.blue : C.ink, color: C.white, display: "grid", placeItems: "center", font: `18px ${mono}`}}>{num}</div><div style={{padding: 20}}><div style={{font: `700 27px ${display}`}}>{instruction}</div><div style={{marginTop: 12, font: `10px ${mono}`, color: C.green}}>CITED · {source.toUpperCase()}</div></div></div>;})}</div>
      </div>
    </Scene>
  );
};

const InspectScene = () => {
  const frame = useCurrentFrame();
  const card = enter(frame, 30, 12);
  return (
    <Scene sheet="SHEET 06 / LIVE INSPECTION">
      <div style={{position: "absolute", left: 82, right: 82, top: 126, bottom: 88, border: `3px solid ${C.ink}`, background: C.white, overflow: "hidden", boxShadow: "14px 14px 0 rgba(11,40,65,.09)", opacity: card, transform: `translateY(${(1 - card) * 18}px)`}}>
        <Img src={staticFile("live-webmcp-inspect.png")} style={{width: "100%", height: "100%", objectFit: "cover"}} />
        <div style={{position: "absolute", left: 18, top: 18, padding: "10px 14px", background: C.green, color: C.white, font: `11px ${mono}`, letterSpacing: ".11em"}}>LIVE WEBMCP RESULT · SHARED PAGE STATE</div>
        <div style={{position: "absolute", right: 20, bottom: 20, padding: "15px 18px", background: "rgba(13,35,53,.96)", color: C.white, border: `2px solid ${C.cyan}`, font: `12px/1.55 ${mono}`}}>inspect_project_blueprint<br /><span style={{color: C.cyan}}>pickName: Expo</span></div>
      </div>
    </Scene>
  );
};

const ConstraintScene = () => {
  const frame = useCurrentFrame();
  const call = enter(frame, 30, 12);
  const switched = frame >= S(6.6);
  const pan = interpolate(frame, [S(7), S(13.4)], [0, -920], clamp);
  return (
    <Scene sheet="SHEET 07 / LIVE CONSTRAINT">
      <div style={{position: "absolute", left: 82, right: 82, top: 126, bottom: 88, border: `3px solid ${C.ink}`, background: C.white, overflow: "hidden", boxShadow: "14px 14px 0 rgba(11,40,65,.09)"}}>
        <Img src={staticFile(switched ? "live-webmcp-revision-full.png" : "live-webmcp-build-full.png")} style={{width: "100%", height: "auto", objectPosition: "top", transform: switched ? `translateY(${pan}px)` : "translateY(-120px)"}} />
        <div style={{position: "absolute", left: 18, top: 18, padding: "10px 14px", background: C.green, color: C.white, font: `11px ${mono}`, letterSpacing: ".11em"}}>LIVE CAPTURE · REV {switched ? "02" : "01"}</div>
        <div style={{position: "absolute", right: 22, top: 22, width: 560, border: `2px solid ${C.cyan}`, background: "rgba(13,35,53,.97)", color: C.white, padding: 20, opacity: call, transform: `translateY(${(1 - call) * 18}px)`}}>
          <div style={{font: `10px ${mono}`, color: C.cyan, letterSpacing: ".12em"}}>CALLED THROUGH THE PAGE'S WEBMCP TOOL</div>
          <div style={{marginTop: 10, font: `15px ${mono}`}}>apply_project_constraint</div>
          <div style={{marginTop: 10, color: "#b6cbd7", font: `11px/1.55 ${mono}`}}>constraint: offline-first prototype<br />preservePicks: ["Expo"]</div>
        </div>
      </div>
    </Scene>
  );
};

const RevisionScene = () => {
  const frame = useCurrentFrame();
  const additions = [
    ["Expo SQLite", "Local database", "#17202b"],
    ["NetInfo", "Connection state", "#159fca"],
    ["expo-examples", "Official reference", C.blue],
  ];
  return (
    <Scene sheet="SHEET 08 / OFFLINE-FIRST REVISION">
      <div style={{position: "absolute", left: 100, right: 100, top: 135}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "end", borderBottom: `3px solid ${C.ink}`, paddingBottom: 17}}><div><div style={{font: `12px ${mono}`, color: C.green, letterSpacing: ".13em"}}>REV 02 · REQUIREMENT APPLIED</div><h2 style={{font: `800 61px ${display}`, textTransform: "uppercase", margin: "6px 0 0"}}>Expo stays. Offline support arrives.</h2></div><div style={{border: `3px solid ${C.green}`, color: "#147a54", padding: "14px 20px", font: `700 16px ${mono}`, transform: "rotate(-2deg)"}}>KEPT · EXPO</div></div>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 26, marginTop: 45}}>
          <LogoNode name="Expo" role="preserved framework" color="#17202b" delay={0} />
          <span style={{font: `38px ${mono}`, color: C.blue}}>＋</span>
          {additions.map(([name, role, color], index) => <LogoNode key={name} name={name} role={role} color={color} small delay={18 + index * 18} />)}
        </div>
        <div style={{marginTop: 40, display: "grid", gridTemplateColumns: "180px 1fr", border: `2px solid ${C.coral}`, background: "#fff5ee"}}><div style={{background: C.coral, color: C.white, display: "grid", placeItems: "center", font: `12px ${mono}`, letterSpacing: ".1em"}}>SYNC TRADEOFF</div><div style={{padding: "19px 24px", font: `22px/1.35 ${body}`}}>Offline writes need a sync queue, a conflict policy, and recovery tests.</div></div>
        <div style={{marginTop: 24, borderTop: `2px solid ${C.ink}`, paddingTop: 14}}><div style={{font: `10px ${mono}`, color: C.muted, letterSpacing: ".12em"}}>STILL IN THE SAME EQUIPPED WORKSPACE</div><div style={{display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 9, marginTop: 11}}>{["Expo MCP", "Expo Doctor", "agent-device", "Callstack skills", "Supabase MCP", "Vibe Intel"].map((name, index) => { const p = enter(frame, 30, 70 + index * 4); return <div key={name} style={{border: `1px solid ${C.line}`, background: C.panel, padding: "11px 9px", font: `10px ${mono}`, textAlign: "center", opacity: p}}>{name}</div>; })}</div></div>
      </div>
    </Scene>
  );
};

const ToolsScene = () => {
  const frame = useCurrentFrame();
  const tools = [
    "build_project_blueprint",
    "inspect_project_blueprint",
    "apply_project_constraint",
    "refine_project_blueprint",
    "survey_stack_tools",
    "consult_stack_intel",
    "render_project_blueprint",
  ];
  return (
    <Scene sheet="SHEET 10 / SEVEN WEBMCP TOOLS">
      <div style={{position: "absolute", left: 92, right: 92, top: 132, display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 30}}>
        <div><div style={{font: `12px ${mono}`, color: C.blue, letterSpacing: ".13em"}}>document.modelContext.registerTool(...)</div><h2 style={{font: `800 59px ${display}`, textTransform: "uppercase", margin: "7px 0 26px"}}>Agent actions change<br />the visible plan</h2><div style={{display: "grid", gap: 10}}>{tools.map((name, index) => {const p = enter(frame, 30, index * 8); return <div key={name} style={{display: "grid", gridTemplateColumns: "44px 1fr", border: `1px solid ${index < 3 ? C.blue : C.line}`, background: index < 3 ? "#e4efff" : C.panel, opacity: p}}><span style={{padding: "12px", background: index < 3 ? C.blue : C.ink, color: C.white, font: `11px ${mono}`, textAlign: "center"}}>{String(index + 1).padStart(2, "0")}</span><span style={{padding: "12px 14px", font: `13px ${mono}`}}>{name}</span></div>;})}</div></div>
        <div style={{border: `3px solid ${C.ink}`, background: C.panel, boxShadow: "12px 12px 0 rgba(11,40,65,.09)", padding: 28}}>
          <div style={{font: `11px ${mono}`, color: C.muted, letterSpacing: ".12em"}}>SHARED PAGE STATE</div>
          <div style={{marginTop: 24, display: "grid", gap: 18}}>
            {[["01", "BUILD", "REV 01 appears"], ["02", "INSPECT", "Expo detail opens"], ["03", "REVISE", "REV 02 redraws"]].map(([num, action, result], index) => {const p = enter(frame, 30, 18 + index * 28); return <div key={num} style={{display: "grid", gridTemplateColumns: "70px 1fr", border: `2px solid ${C.ink}`, opacity: p, transform: `translateX(${(1 - p) * 24}px)`}}><div style={{background: index === 2 ? C.green : C.ink, color: C.white, display: "grid", placeItems: "center", font: `18px ${mono}`}}>{num}</div><div style={{padding: "18px 20px"}}><div style={{font: `11px ${mono}`, color: C.blue}}>{action}</div><div style={{font: `700 25px ${display}`, marginTop: 5}}>{result}</div></div></div>;})}
          </div>
          <div style={{marginTop: 28, background: C.ink, color: C.white, padding: 17, textAlign: "center", font: `11px ${mono}`, letterSpacing: ".1em"}}>ONE PAGE · ONE PLAN · SHARED CONTEXT</div>
        </div>
      </div>
    </Scene>
  );
};

const OutroScene = () => {
  const frame = useCurrentFrame();
  const p = enter(frame, 30, 0);
  return <Scene sheet="SHEET 11 / READY TO BUILD"><div style={{position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center"}}><div style={{opacity: p, transform: `scale(${.94 + .06 * p})`}}><div style={{font: `13px ${mono}`, color: C.blue, letterSpacing: ".18em"}}>STACK BLUEPRINT</div><h2 style={{font: `800 91px/.95 ${display}`, textTransform: "uppercase", margin: "22px 0 28px"}}>One current plan.<br /><span style={{color: C.blue}}>Built together.</span></h2><div style={{height: 3, width: 760, margin: "0 auto 25px", background: C.ink}} /><div style={{font: `30px ${body}`}}>stack-blueprint.vercel.app</div><div style={{marginTop: 17, font: `12px ${mono}`, color: C.muted, letterSpacing: ".12em"}}>SOFTWARE STACK · AI WORKSPACE · EXECUTION INSTRUCTIONS</div></div></div></Scene>;
};

const CaptionLayer = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = frame / fps * 1000;
  const caption = captions.find((item) => item.startMs <= now && item.endMs > now);
  if (!caption) return null;
  const fade = Math.min(1, (now - caption.startMs) / 120, (caption.endMs - now) / 120);
  return <div style={{position: "absolute", left: 220, right: 220, bottom: 28, zIndex: 50, display: "flex", justifyContent: "center", opacity: fade}}><div style={{background: "rgba(11,40,65,.95)", border: "1px solid rgba(255,255,255,.22)", color: C.white, padding: "12px 20px", font: `23px/1.22 ${body}`, textAlign: "center", boxShadow: "0 6px 18px rgba(11,40,65,.16)"}}>{caption.text}</div></div>;
};

export const StackBlueprintDemo = () => (
  <AbsoluteFill style={{background: C.paper}}>
    <Audio src={staticFile("ambient-bed.wav")} loop volume={0.58} />
    <Audio src={staticFile("voiceover.m4a")} />
    <Sequence from={S(0)} durationInFrames={S(3.5)} premountFor={S(1)}><TitleScene /></Sequence>
    <Sequence from={S(3.5)} durationInFrames={S(15.7)} premountFor={S(1)}><PromptScene /></Sequence>
    <Sequence from={S(19.2)} durationInFrames={S(9.9)} premountFor={S(1)}><StackOnlyScene /></Sequence>
    <Sequence from={S(29.1)} durationInFrames={S(11.5)} premountFor={S(1)}><WebMcpScene /></Sequence>
    <Sequence from={S(40.6)} durationInFrames={S(11.2)} premountFor={S(1)}><ResearchScene /></Sequence>
    <Sequence from={S(51.8)} durationInFrames={S(27.16)} premountFor={S(1)}><WorkspaceScene /></Sequence>
    <Sequence from={S(78.96)} durationInFrames={S(6.24)} premountFor={S(1)}><CapabilitiesScene /></Sequence>
    <Sequence from={S(85.2)} durationInFrames={S(14.6)} premountFor={S(1)}><InspectScene /></Sequence>
    <Sequence from={S(99.8)} durationInFrames={S(13.6)} premountFor={S(1)}><ConstraintScene /></Sequence>
    <Sequence from={S(113.4)} durationInFrames={S(12.3)} premountFor={S(1)}><RevisionScene /></Sequence>
    <Sequence from={S(125.7)} durationInFrames={S(21.4)} premountFor={S(1)}><IntelScene /></Sequence>
    <Sequence from={S(147.1)} durationInFrames={S(13.3)} premountFor={S(1)}><ToolsScene /></Sequence>
    <Sequence from={S(160.4)} durationInFrames={S(3.6)} premountFor={S(1)}><OutroScene /></Sequence>
    <CaptionLayer />
  </AbsoluteFill>
);
